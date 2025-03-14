import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RecordCreateRequest, RecordResponse, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
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
    private readonly childService: ChildService,
    private readonly reminderService: ReminderService,
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
  async createRecord({ record, childId }: { record: RecordCreateRequest; childId: string }): Promise<RecordResponse> {
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
      },
    });

    // Process metrics sequentially to avoid any race conditions
    for (const data of record.data) {
      const tag_id = await this.getTagIdByValue({
        value: data.value,
        metric_id: data.metric_id,
        userExpectBirthDate: child.expected_birth_date,
        visit_doctor_date: new Date(record.visit_doctor_date),
      });

      await this.dataService.RecordMetric.create({
        data: {
          value: data.value,
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

    const formatRecord = await this.getRecordById(newRecord.visit_record_id);
    return formatRecord[0];
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
   * @returns Promise<RecordResponse[]>
   * @async
   * @private
   */
  private async formatRecord(records: VisitRecordIncludeOtherTables[], child: Child): Promise<RecordResponse[]> {
    return await Promise.all(
      records.map(async (record) => {
        // Calculate pregnancy week for this record
        const week = this.timeUtilsService.calculatePregnancyWeeks({
          expectedBirthDate: child.expected_birth_date,
          visitDate: record.visit_doctor_date,
        });

        // Extract just the values and metric IDs from the metrics
        const data = await Promise.all(
          record.visit_record_metric.map(async (metricRecord) => {
            const standardId = await this.getStandardIdByWeek({ week, metric_id: metricRecord.metric_id });
            return {
              metric_id: metricRecord.metric_id,
              value: metricRecord.value,
              tag_id: metricRecord.tag_id,
              standard_id: standardId,
              child_id: record.child_id,
            };
          }),
        );

        // Return the simplified record structure
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
      }),
    );
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
    value,
    metric_id,
    userExpectBirthDate,
    visit_doctor_date,
  }: {
    value: number;
    metric_id: string;
    userExpectBirthDate: Date;
    visit_doctor_date: Date;
  }): Promise<string | null> {
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
      const { lowerbound, upperbound } = exactMatch;
      return value < lowerbound || value > upperbound ? metric.tag_id : null;
    }

    // Find the last standard with week less than current week
    const applicableStandard = standards.filter((s) => s.week < week).sort((a, b) => b.week - a.week)[0]; // Get the highest applicable week

    if (applicableStandard) {
      const { lowerbound, upperbound } = applicableStandard;
      return value < lowerbound || value > upperbound ? metric.tag_id : null;
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
    metricsData: Array<{ metric_id: string; value: number }>,
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
        value: metricData.value,
        metric_id: metricData.metric_id,
        userExpectBirthDate: childExpectBirthDate,
        visit_doctor_date: visitDoctorDate,
      });

      const existingMetric = existingMetricMap.get(metricData.metric_id);

      if (existingMetric) {
        // Update existing metric
        await this.dataService.RecordMetric.update({
          where: {
            visit_record_metric_id: existingMetric.visit_record_metric_id,
          },
          data: {
            value: metricData.value,
            tag_id: tagId || null,
            updated_at: new Date(Date.now()),
          },
        });
      } else {
        // Create new metric
        await this.dataService.RecordMetric.create({
          data: {
            value: metricData.value,
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

  private async getStandardIdByWeek({ week, metric_id }: { week: number; metric_id: string }): Promise<string | null> {
    const standards = await this.dataService.Standard.findMany({
      where: {
        metric_id,
      },
    });

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
}
