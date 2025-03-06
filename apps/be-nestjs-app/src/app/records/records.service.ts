import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RecordCreateRequest, RecordResponse, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { MetricService } from '../metric/metric.service';
import { ReminderService } from '../reminder/reminder.service';
import { UsersService } from '../users/users.service';
import { TimeUtilsService } from '../utils/time/timeUtils.service';

@Injectable()
export class RecordsService {
  constructor(
    private readonly dataService: DatabaseService,
    private readonly timeUtilsService: TimeUtilsService,
    private readonly metricService: MetricService,
    private readonly userService: UsersService,
    private readonly reminderService: ReminderService,
  ) {}

  async createRecord({ record, userId }: { record: RecordCreateRequest; userId: string }): Promise<RecordResponse> {
    if (!userId) {
      throw new UnauthorizedException('access token is required');
    }

    const user = await this.dataService.User.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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
        created_at: new Date(),
        user: {
          connect: {
            user_id: userId,
          },
        },
        hospital: {
          connect: {
            hospital_id: record.hospital_id,
          },
        },
        visit_record_metric: {
          createMany: {
            data: await Promise.all(
              record.data.map(async (data) => {
                const tag_id = await this.checkRecordValue({
                  value: data.value,
                  metric_id: data.metric_id,
                  userExpectBirthDate: user.expected_birth_date,
                  visit_doctor_date: new Date(record.visit_doctor_date),
                });

                return {
                  value: data.value,
                  created_at: new Date(),
                  updated_at: new Date(),
                  metric_id: data.metric_id,
                  tag_id: tag_id ? tag_id : null,
                };
              }),
            ),
          },
        },
      },
      include: {
        visit_record_metric: true,
        media: true,
        hospital: true,
      },
    });

    // Create reminder
    await this.reminderService.createByNextVisitDoctorDate({
      user_id: userId,
      visit_record_id: newRecord.visit_record_id,
      next_visit_doctor_date: record.next_visit_doctor_date,
    });

    const formatRecord = await this.getRecordById(newRecord.visit_record_id);
    return formatRecord[0];
  }

  async getRecordByUserId(userId: string): Promise<{ total: number; data: RecordResponse[] }> {
    const user = await this.dataService.User.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const records = await this.dataService.Record.findMany({
      where: { user_id: userId },
      include: {
        visit_record_metric: true,
        media: true,
        hospital: true,
      },
      orderBy: {
        visit_doctor_date: 'asc',
      },
    });

    if (!records) {
      throw new NotFoundException('Record not found');
    }

    const result = await this.formatRecord(records, user);

    return {
      total: result.length,
      data: result,
    };
  }

  private async checkRecordValue({
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
      return null;
    }

    const standards = await this.dataService.Standard.findMany({
      where: { metric_id },
      orderBy: { week: 'asc' }, // Ensure standards are sorted
    });

    if (standards.length === 0) {
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

  async formatRecord(records, user): Promise<RecordResponse[]> {
    return await Promise.all(
      records
        .map(async (record) => {
          const week = this.timeUtilsService.calculatePregnancyWeeks({
            expectedBirthDate: user.expected_birth_date,
            visitDate: record.visit_doctor_date,
          });

          const data = await Promise.all(
            record.visit_record_metric.map(async (metricRecord) => {
              const metric = await this.metricService.findByMetricIdAndWeek({
                metricId: metricRecord.metric_id,
                week,
              });

              const tag = metricRecord.tag_id
                ? await this.dataService.Tag.findUnique({
                    where: { tag_id: metricRecord.tag_id },
                  })
                : undefined;

              if (metric) {
                return {
                  record_id: record.visit_record_id,
                  value: metricRecord.value,
                  metric_id: metricRecord.metric_id,
                  metric_title: metric.title,
                  metric_measure: metric.measurement_unit,
                  metric_upperBoundMsg: metric.upperbound_msg,
                  metric_lowerBoundMsg: metric.lowerbound_msg,
                  standard_lowerbound: metric.standard?.[0]?.lowerbound,
                  standard_upperbound: metric.standard?.[0]?.upperbound,
                  standard_week: metric.standard?.[0]?.week,
                  whoStandardValue: metric.standard?.[0]?.who_standard_value,
                  tag,
                  status: metric.status,
                };
              }
            }),
          );

          return {
            visit_record_id: record.visit_record_id,
            week,
            visit_doctor_date: record.visit_doctor_date,
            next_visit_doctor_date: record.next_visit_doctor_date,
            doctor_name: record.doctor_name,
            hospital: record.hospital,
            user_id: record.user_id,
            data,
            media: record.media,
          };
        })
        .sort((a, b) => {
          return new Date(a.visit_doctor_date).getTime() - new Date(b.visit_doctor_date).getTime();
        }), // sort by visit_doctor_date
    );
  }

  async getRecordById(recordId: string) {
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

    const user = await this.dataService.User.findUnique({
      where: { user_id: record.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.formatRecord([record], user);
  }

  async updateRecord(record: RecordUpdateRequest) {
    // Check if record exists
    const newRecord = await this.dataService.Record.update({
      where: { visit_record_id: record.visit_record_id },
      data: {
        visit_doctor_date: record.visit_doctor_date,
        next_visit_doctor_date: record.next_visit_doctor_date,
        doctor_name: record.doctor_name,
      },
    });

    // Update reminder
    if (record.next_visit_doctor_date) {
      await this.reminderService.updateByNextVisitDoctorDate({
        next_visit_doctor_date: record.next_visit_doctor_date,
        visit_record_id: record.visit_record_id,
        user_id: newRecord.user_id,
      });
    }

    // Update record metric
    if (record.data) {
      for (const record_metric of record.data) {
        // Check if metric exists
        const metric = await this.dataService.Metric.findUnique({
          where: { metric_id: record_metric.metric_id },
        });
        if (!metric) {
          throw new NotFoundException('Metric not found');
        }

        // Check if user exists
        const user = await this.userService.getUserById(newRecord.user_id);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Check if this record metric should have a tag
        const tag_id = await this.checkRecordValue({
          value: record_metric.value,
          metric_id: record_metric.metric_id,
          userExpectBirthDate: user.expected_birth_date,
          visit_doctor_date: new Date(newRecord.visit_doctor_date),
        });

        // Check if this record metric already exists
        const is_existed = await this.dataService.RecordMetric.findFirst({
          where: {
            metric_id: record_metric.metric_id,
            visit_record_id: record.visit_record_id,
          },
        });

        // Create record metric if not existed
        if (!is_existed) {
          await this.dataService.RecordMetric.create({
            data: {
              value: record_metric.value,
              created_at: new Date(),
              updated_at: new Date(),
              metric_id: record_metric.metric_id,
              visit_record_id: record.visit_record_id,
              tag_id: tag_id ? tag_id : null,
            },
          });
        } else {
          // Update record metric if existed
          await this.dataService.RecordMetric.update({
            where: {
              visit_record_metric_id: is_existed.visit_record_metric_id,
            },
            data: {
              value: record_metric.value,
              tag_id: tag_id ? tag_id : null,
            },
          });
        }
      }
      return await this.getRecordById(record.visit_record_id);
    }

    if (record.hospital_id) {
      const check = await this.dataService.Hospital.findUnique({ where: { hospital_id: record.hospital_id } });
      if (!check) {
        throw new NotFoundException('Hospital not found');
      }

      await this.dataService.Record.update({
        where: { visit_record_id: record.visit_record_id },
        data: {
          hospital: {
            connect: {
              hospital_id: record.hospital_id,
            },
          },
        },
      });
    }
    const formatRecord = await this.getRecordById(record.visit_record_id);
    return formatRecord[0];
  }

  async deleteRecord(recordId: string) {
    await Promise.all([
      this.dataService.RecordMetric.deleteMany({
        where: { visit_record_id: recordId },
      }),
      this.dataService.Media.deleteMany({
        where: { visit_record_id: recordId },
      }),
      this.dataService.Record.delete({
        where: { visit_record_id: recordId },
      }),
      this.dataService.Reminder.deleteMany({
        where: { visit_record_id: recordId },
      }),
    ]);
    return { message: 'Record deleted' };
  }

  /**
   * Updates record metrics data within a transaction
   */
  private async updateRecordMetrics(
    visitRecordId: string,
    metricsData: Array<{ metric_id: string; value: number }>,
    userExpectBirthDate: Date,
    visitDoctorDate: Date,
  ): Promise<void> {
    // Fetch all metrics at once to validate
    const metricIds = metricsData.map((m) => m.metric_id);
    const metrics = await this.dataService.Metric.findMany({
      where: { metric_id: { in: metricIds } },
    });

    if (metrics.length !== metricIds.length) {
      throw new NotFoundException('One or more metrics not found');
    }

    // Get existing record metrics to determine create vs update
    const existingMetrics = await this.dataService.RecordMetric.findMany({
      where: {
        visit_record_id: visitRecordId,
        metric_id: { in: metricIds },
      },
    });

    const existingMetricMap = new Map(existingMetrics.map((m) => [m.metric_id, m]));

    // Process each metric
    for (const metricData of metricsData) {
      // Check value and determine tag
      const tagId = await this.checkRecordValue({
        value: metricData.value,
        metric_id: metricData.metric_id,
        userExpectBirthDate: userExpectBirthDate,
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
            updated_at: new Date(),
          },
        });
      } else {
        // Create new metric
        await this.dataService.RecordMetric.create({
          data: {
            value: metricData.value,
            created_at: new Date(),
            updated_at: new Date(),
            metric_id: metricData.metric_id,
            visit_record_id: visitRecordId,
            tag_id: tagId || null,
          },
        });
      }
    }
  }
}
