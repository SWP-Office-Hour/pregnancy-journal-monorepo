import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  ChildType,
  RecordCreateRequest,
  RecordResponse,
  RecordUpdateRequest,
  RecordWithWarningResponse,
  Standard,
  WarningListType,
} from '@pregnancy-journal-monorepo/contract';
import { ChildService } from '../child/child.service';
import { Child } from '../child/entities/child.entity';
import { DatabaseService } from '../database/database.service';
import { MediaService } from '../media/media.service';
import { ReminderService } from '../reminder/reminder.service';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { VisitRecordIncludeOtherTables, VisitRecordMetric } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    private readonly dataService: DatabaseService,
    private readonly timeUtilsService: TimeUtilsService,
    @Inject(forwardRef(() => ChildService)) private readonly childService: ChildService,
    @Inject(forwardRef(() => ReminderService)) private readonly reminderService: ReminderService,
    private readonly mediaService: MediaService,
  ) {}

  //================================================================================================
  //                          PUBLIC FUNCTIONS - CRUD OPERATIONS
  //================================================================================================

  /**
   * Create a new record and return formatted response
   * @param record
   * @param userId
   * @returns Promise<RecordResponse>
   * @throws NotFoundException
   */
  async createRecord({ record, childId }: { record: RecordCreateRequest; childId: string }): Promise<RecordWithWarningResponse> {
    const child = await this.dataService.Child.findUnique({
      where: { child_id: childId },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    if (!record.hospital_id) {
      throw new NotFoundException('Hospital not found');
    } else {
      const hospital = await this.dataService.Hospital.findUnique({
        where: { hospital_id: record.hospital_id },
      });
      if (!hospital) {
        throw new NotFoundException('Hospital not found');
      }
    }
    for (const data of record.data) {
      const metric = await this.dataService.Metric.findUnique({
        where: { metric_id: data.metric_id },
      });
      if (!metric) {
        throw new NotFoundException('Metric not found');
      }
    }

    const newRecord = await this.dataService.Record.create({
      data: {
        visit_doctor_date: record.visit_doctor_date,
        next_visit_doctor_date: record.next_visit_doctor_date,
        doctor_name: record.doctor_name,
        created_at: new Date(Date.now()),
        child: {
          connect: {
            child_id: child.child_id,
          },
        },
        hospital: {
          connect: {
            hospital_id: record.hospital_id,
          },
        },
      },
      include: {
        media: true,
        hospital: true,
        visit_record_metric: true,
      },
    });

    // Process metrics sequentially to avoid any race conditions
    for (const data of record.data) {
      const tag_id = await this.getTagIdByValue({
        valueAsString: data.value,
        metric_id: data.metric_id,
        userExpectBirthDate: child.expected_birth_date,
        visit_doctor_date: new Date(record.visit_doctor_date),
      });
      const [value, value_extended] = data.value.split('/');
      await this.dataService.RecordMetric.create({
        data: {
          value: Number(value),
          value_extended: value_extended ? Number(value_extended) : null,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          metric_id: data.metric_id,
          visit_record_id: newRecord.visit_record_id,
          tag_id: tag_id ? tag_id : null,
        },
      });
    }

    // Create reminder
    await this.reminderService.createByNextVisitDoctorDate({
      user_id: child.user_id,
      visit_record_id: newRecord.visit_record_id,
      next_visit_doctor_date: record.next_visit_doctor_date,
    });

    const warnings = await this.getWarningMessages(newRecord, child);

    const formatRecord = await this.getRecordById(newRecord.visit_record_id);
    return { ...formatRecord[0], warnings };
  }

  /**
   * Get all records by user ID and return formatted response
   * @param childId
   * @returns Promise<{ total: number; data: RecordResponse[] }>
   * @throws NotFoundException
   * @async
   */
  async getRecordByChildId(childId: string): Promise<{ total: number; data: RecordResponse[] }> {
    const child = await this.dataService.Child.findUnique({
      where: { child_id: childId },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const records: VisitRecordIncludeOtherTables[] = await this.dataService.Record.findMany({
      where: { child_id: childId },
      include: {
        visit_record_metric: true,
        media: true,
        hospital: true,
      },
      orderBy: {
        visit_doctor_date: 'asc',
      },
    });

    if (records.length === 0) {
      return { total: 0, data: [] };
    }

    const result = await this.formatRecord(records, child);

    return {
      total: result.length,
      data: result,
    };
  }

  /**
   * Update record by record ID and return formatted response
   * @functions-used getChildById(), updateRecordMetrics(), getRecordById(), updateByNextVisitDoctorDate()
   * @param record
   * @returns Promise<RecordResponse>
   * @throws NotFoundException
   * @returns Promise<RecordResponse>
   * @async
   */
  async updateRecord(record: RecordUpdateRequest): Promise<RecordResponse> {
    // Find existing record to get child ID
    const existingRecord = await this.dataService.Record.findUnique({
      where: { visit_record_id: record.visit_record_id },
      select: { child_id: true },
    });

    if (!existingRecord) {
      throw new NotFoundException('Record not found');
    }

    // Get child details (needed for metric updates)
    const child = await this.childService.getChildById(existingRecord.child_id);

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    // Verify hospital exists before connecting
    const hospital = await this.dataService.Hospital.findUnique({
      where: { hospital_id: record.hospital_id },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Update base record
    const newRecord = await this.dataService.Record.update({
      where: { visit_record_id: record.visit_record_id },
      data: {
        visit_doctor_date: record.visit_doctor_date,
        next_visit_doctor_date: record.next_visit_doctor_date,
        doctor_name: record.doctor_name,
        hospital: {
          connect: {
            hospital_id: hospital.hospital_id,
          },
        },
      },
    });

    // Update reminder if needed
    if (record.next_visit_doctor_date) {
      await this.reminderService.updateByNextVisitDoctorDate({
        next_visit_doctor_date: record.next_visit_doctor_date,
        visit_record_id: record.visit_record_id,
        user_id: child.user_id,
      });
    }

    // Update record metrics if provided
    if (record.data && record.data.length > 0) {
      await this.updateRecordMetrics(record.visit_record_id, record.data, child.expected_birth_date, new Date(newRecord.visit_doctor_date));
    }

    // Return formatted record
    const formatRecord = await this.getRecordById(record.visit_record_id);
    return formatRecord[0];
  }

  /**
   * Delete record by record ID and return success message
   * @param recordId
   * @returns Promise<{ message: string }>
   * @throws NotFoundException
   * @async
   */
  async deleteRecord(recordId: string) {
    try {
      const record = await this.dataService.Record.findUnique({
        where: { visit_record_id: recordId },
      });

      if (!record) {
        throw new NotFoundException('Record not found');
      }

      const deletedRecordMetric = await this.dataService.RecordMetric.findMany({
        where: { visit_record_id: recordId },
      });

      if (deletedRecordMetric.length > 0) {
        await this.dataService.RecordMetric.deleteMany({
          where: { visit_record_id: recordId },
        });
      }

      const deletedMedia = await this.dataService.Media.findMany({
        where: { visit_record_id: recordId },
      });

      if (deletedMedia.length > 0) {
        for (const media of deletedMedia) {
          await this.mediaService.remove(media.media_id);
        }
      }

      const deletedReminder = await this.dataService.Reminder.findMany({
        where: { visit_record_id: recordId },
      });

      if (deletedReminder.length > 0) {
        await this.dataService.Reminder.deleteMany({
          where: { visit_record_id: recordId },
        });
      }

      // Delete the main record last
      await this.dataService.Record.delete({
        where: { visit_record_id: recordId },
      });
      return { message: 'Record deleted' };
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
   * Get record by record ID and return formatted response
   * @param recordId
   * @returns Promise<RecordResponse>
   * @throws NotFoundException
   * @async
   */
  public async getRecordById(recordId: string) {
    const record = await this.dataService.Record.findUnique({
      where: { visit_record_id: recordId },
      include: {
        visit_record_metric: true,
        media: true,
        hospital: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const child = await this.dataService.Child.findUnique({
      where: { child_id: record.child_id },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return await this.formatRecord([record], child);
  }

  //================================================================================================
  //                          PRIVATE FUNCTIONS - HELPER FUNCTIONS
  //================================================================================================

  /**
   * Format records for response
   * @param records
   * @param child
   * @param standards
   * @returns Promise<RecordResponse[]>
   * @async
   * @private
   */
  // private async formatRecord(records: VisitRecordIncludeOtherTables[], child: Child, standards: Standard[]): Promise<RecordResponse[]> {
  //   return await Promise.all(
  //     records.map(async (record) => {
  //       // Calculate pregnancy week for this record
  //       const week = this.timeUtilsService.calculatePregnancyWeeks({
  //         expectedBirthDate: child.expected_birth_date,
  //         visitDate: record.visit_doctor_date,
  //       });
  //
  //       // Extract just the values and metric IDs from the metrics
  //       const data = await Promise.all(
  //         record.visit_record_metric.map(async (metricRecord) => {
  //           const standardId = await this.getStandardIdByWeek({ week, metric_id: metricRecord.metric_id });
  //           return {
  //             metric_id: metricRecord.metric_id,
  //             value: metricRecord.value,
  //             tag_id: metricRecord.tag_id,
  //             standard_id: standardId,
  //             child_id: record.child_id,
  //           };
  //         }),
  //       );
  //
  //       // Return the simplified record structure
  //       return {
  //         week,
  //         visit_record_id: record.visit_record_id,
  //         visit_doctor_date: record.visit_doctor_date,
  //
  //         next_visit_doctor_date: record.next_visit_doctor_date as Date,
  //         hospital: record.hospital,
  //         doctor_name: record.doctor_name,
  //         media: record.media.map((m) => ({
  //           media_id: m.media_id,
  //           media_url: m.media_url,
  //         })),
  //         data,
  //       };
  //     }),
  //   );
  // }

  private async formatRecord(records: VisitRecordIncludeOtherTables[], child: Child): Promise<RecordResponse[]> {
    // Fetch all needed standards in one query if not provided

    // Get unique metric IDs from all records
    const metricIds = new Set<string>();
    records.forEach((record) => {
      record.visit_record_metric.forEach((metric) => {
        metricIds.add(metric.metric_id);
      });
    });

    // Fetch all standards for these metrics in one query
    const standards = await this.dataService.Standard.findMany({
      where: {
        metric_id: { in: Array.from(metricIds) },
      },
    });

    // Create a lookup map for faster access
    const standardsMap = new Map<string, Standard[]>();
    standards.forEach((standard) => {
      if (!standardsMap.has(standard.metric_id)) {
        standardsMap.set(standard.metric_id, []);
      }
      standardsMap.get(standard.metric_id)?.push(standard);
    });

    // Sort standards by week for each metric
    standardsMap.forEach((standards, _) => {
      standards.sort((a, b) => a.week - b.week);
    });

    return records.map((record) => {
      const week = this.timeUtilsService.calculatePregnancyWeeks({
        expectedBirthDate: child.expected_birth_date,
        visitDate: record.visit_doctor_date,
      });

      const data = record.visit_record_metric.map((metricRecord) => {
        // Use the cached standards instead of making a DB call
        const standardId = this.getStandardIdFromCache(week, metricRecord.metric_id, standardsMap);
        const value = metricRecord.value_extended ? `${metricRecord.value}/${metricRecord.value_extended}` : metricRecord.value.toString();
        return {
          metric_id: metricRecord.metric_id,
          value,
          tag_id: metricRecord.tag_id,
          standard_id: standardId,
          child_id: record.child_id,
        };
      });

      return {
        week,
        visit_record_id: record.visit_record_id,
        visit_doctor_date: record.visit_doctor_date,
        next_visit_doctor_date: record.next_visit_doctor_date as Date,
        hospital: record.hospital,
        doctor_name: record.doctor_name,
        media: record.media.map((m) => ({
          media_id: m.media_id,
          media_url: m.media_url,
        })),
        data,
      };
    });
  }

  // New helper method to get standard ID from cached data
  private getStandardIdFromCache(week: number, metric_id: string, standardsMap: Map<string, Standard[]>): string | null {
    const standards = standardsMap.get(metric_id) || [];

    if (standards.length === 0) {
      return null;
    }

    if (week < standards[0].week) {
      return null;
    }

    if (week > standards[standards.length - 1].week) {
      return standards[standards.length - 1].standard_id;
    }

    const standard = standards.find((s) => s.week === week);
    if (standard) {
      return standard.standard_id;
    }

    return standards.filter((s) => s.week < week).sort((a, b) => b.week - a.week)[0].standard_id;
  }

  /**
   * Checks the value of a record metric against the standard
   * Returns the tag ID if the value is out of bounds
   * @param value
   * @param metric_id
   * @param userExpectBirthDate
   * @param visit_doctor_date
   * @private
   * @async
   */
  private async getTagIdByValue({
    valueAsString,
    metric_id,
    userExpectBirthDate,
    visit_doctor_date,
  }: {
    valueAsString: string;
    metric_id: string;
    userExpectBirthDate: Date;
    visit_doctor_date: Date;
  }): Promise<string | null> {
    const [value, value_extended] = valueAsString.split('/');
    if (value == '0' || value == '') {
      return null;
    }
    const week = this.timeUtilsService.calculatePregnancyWeeks({
      expectedBirthDate: userExpectBirthDate,
      visitDate: visit_doctor_date,
    });

    const metric = await this.dataService.Metric.findUnique({
      where: { metric_id },
    });

    if (!metric) {
      console.warn(`Metric with ID ${metric_id} not found when checking record value`);
      return null;
    }

    const standards = await this.dataService.Standard.findMany({
      where: { metric_id },
      orderBy: { week: 'asc' }, // Ensure standards are sorted
    });

    if (standards.length === 0) {
      console.warn(`No standards found for metric ${metric_id} (${metric.title || 'unnamed'})`);
      return null;
    }

    // Handle case where week is before first standard
    if (week < standards[0].week) {
      return null;
    }

    // Find exact match first
    const exactMatch = standards.find((s) => s.week === week);
    if (exactMatch) {
      const [value, value_extended] = valueAsString.split('/');
      const { lowerbound, upperbound } = exactMatch;
      if (value_extended) {
        return Number(value) < lowerbound || Number(value_extended) > upperbound ? metric.tag_id : null;
      } else {
        return Number(value) < lowerbound || Number(value) > upperbound ? metric.tag_id : null;
      }
    }

    // Find the last standard with week less than current week
    const applicableStandard = standards.filter((s) => s.week < week).sort((a, b) => b.week - a.week)[0]; // Get the highest applicable week

    if (applicableStandard) {
      const [value, value_extended] = valueAsString.split('/');
      const { lowerbound, upperbound } = applicableStandard;
      if (value_extended) {
        return Number(value) < lowerbound || Number(value_extended) > upperbound ? metric.tag_id : null;
      } else {
        return Number(value) < lowerbound || Number(value) > upperbound ? metric.tag_id : null;
      }
    }

    return null;
  }

  /**
   * Updates record metrics data based on provided data and creates new record metrics if not found
   * @param visitRecordId Visit record ID
   * @param metricsData Array of metric data to update
   * @param childExpectBirthDate Child expected birthdate
   * @param visitDoctorDate Visit doctor date
   * @returns Promise<void>
   * @throws NotFoundException
   * @private
   * @async
   */
  private async updateRecordMetrics(
    visitRecordId: string,
    metricsData: Array<{ metric_id: string; value: string }>,
    childExpectBirthDate: Date,
    visitDoctorDate: Date,
  ): Promise<void> {
    // Fetch all metrics at once to validate
    const metricIds = metricsData.map((m) => m.metric_id);
    const metrics = await this.dataService.Metric.findMany({
      where: { metric_id: { in: metricIds } },
    });

    if (metrics.length !== metricIds.length) {
      const missingMetricIds = metricIds.filter((id) => !metrics.find((m) => m.metric_id === id));
      throw new NotFoundException(`The following metrics were not found: ${missingMetricIds.join(', ')}`);
    }

    // Get existing record metrics to determine create vs update
    const existingMetrics: VisitRecordMetric[] = await this.dataService.RecordMetric.findMany({
      where: {
        visit_record_id: visitRecordId,
        metric_id: { in: metricIds },
      },
    });

    const existingMetricMap = new Map(existingMetrics.map((m) => [m.metric_id, m]));

    // Process each metric
    for (const metricData of metricsData) {
      // Check value and determine tag
      const tagId = await this.getTagIdByValue({
        valueAsString: metricData.value,
        metric_id: metricData.metric_id,
        userExpectBirthDate: childExpectBirthDate,
        visit_doctor_date: visitDoctorDate,
      });

      const existingMetric = existingMetricMap.get(metricData.metric_id);

      const [value, value_extended] = metricData.value.split('/');
      if (existingMetric) {
        await this.dataService.RecordMetric.update({
          where: {
            visit_record_metric_id: existingMetric.visit_record_metric_id,
          },
          data: {
            value: Number(value),
            value_extended: value_extended ? Number(value_extended) : null,
            tag_id: tagId || null,
            updated_at: new Date(Date.now()),
          },
        });
      } else {
        // Create new metric
        await this.dataService.RecordMetric.create({
          data: {
            value: Number(value),
            value_extended: value_extended ? Number(value_extended) : null,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
            metric_id: metricData.metric_id,
            visit_record_id: visitRecordId,
            tag_id: tagId || null,
          },
        });
      }
    }
  }

  async getWarningMessages(record: VisitRecordIncludeOtherTables, child: ChildType): Promise<WarningListType> {
    // Early exit if no metrics
    if (!record.visit_record_metric || record.visit_record_metric.length === 0) {
      return [];
    }

    // Get unique metric IDs using Set for efficiency
    const metricIds = Array.from(new Set(record.visit_record_metric.map((metric) => metric.metric_id)));

    if (metricIds.length === 0) return [];

    // Fetch all metrics and standards in bulk (just two queries)
    const [metrics, standards] = await Promise.all([
      this.dataService.Metric.findMany({
        where: { metric_id: { in: metricIds } },
        select: {
          metric_id: true,
          upperbound_msg: true,
          lowerbound_msg: true,
        },
      }),
      this.dataService.Standard.findMany({
        where: { metric_id: { in: metricIds } },
        orderBy: { week: 'asc' },
        select: {
          metric_id: true,
          week: true,
          lowerbound: true,
          upperbound: true,
        },
      }),
    ]);

    // Create efficient lookup maps
    const metricsMap = new Map(metrics.map((m) => [m.metric_id, m]));
    const standardsMap = new Map<string, any[]>();

    // Group standards by metric_id
    for (const standard of standards) {
      if (!standardsMap.has(standard.metric_id)) {
        standardsMap.set(standard.metric_id, []);
      }
      standardsMap.get(standard.metric_id)!.push(standard);
    }

    // Calculate week once
    const week = this.timeUtilsService.calculatePregnancyWeeks({
      expectedBirthDate: child.expected_birth_date,
      visitDate: record.visit_doctor_date,
    });

    const warnings: string[] = [];

    // Process all metrics
    for (const metric of record.visit_record_metric) {
      // Skip invalid values immediately
      if (!metric.value || metric.value === 0) continue;

      const metricInfo = metricsMap.get(metric.metric_id);
      if (!metricInfo) continue;

      const standards = standardsMap.get(metric.metric_id);
      if (!standards || standards.length === 0) continue;

      // Skip if week is before first standard
      if (week < standards[0].week) continue;

      const valueAsString = metric.value_extended ? `${metric.value}/${metric.value_extended}` : String(metric.value);

      const [value, value_extended] = valueAsString.split('/');
      if (value === '0' || value === '' || value === ' ') continue;

      // Find applicable standard - find exact match first
      let applicable = standards.find((s) => s.week === week);

      // If no exact match, find the MOST RECENT standard before current week
      // THIS IS THE KEY CORRECTION - sort in DESCENDING order to get most recent!
      if (!applicable) {
        const applicableStandards = standards.filter((s) => s.week < week).sort((a, b) => b.week - a.week); // FIXED: descending order

        applicable = applicableStandards.length > 0 ? applicableStandards[0] : null;
      }

      if (!applicable) continue;

      // Check bounds and create warning if needed
      const { lowerbound, upperbound } = applicable;

      // Correct comparison logic for warnings
      if (value_extended) {
        if (Number(value_extended) > upperbound) {
          warnings.push(metricInfo.upperbound_msg);
        } else if (Number(value) < lowerbound) {
          warnings.push(metricInfo.lowerbound_msg);
        }
      } else {
        if (Number(value) > upperbound) {
          warnings.push(metricInfo.upperbound_msg);
        } else if (Number(value) < lowerbound) {
          warnings.push(metricInfo.lowerbound_msg);
        }
      }
    }

    return warnings;
  }

  async getWarning(record_id: string) {
    const record = await this.dataService.Record.findUnique({
      where: { visit_record_id: record_id },
      include: {
        media: true,
        hospital: true,
        visit_record_metric: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const child = await this.dataService.Child.findUnique({
      where: { child_id: record.child_id },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    console.log(record);

    return await this.getWarningMessages(record, child);
  }
}
