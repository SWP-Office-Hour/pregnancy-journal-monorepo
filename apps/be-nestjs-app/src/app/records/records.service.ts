import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RecordCreateRequest, RecordResponse, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { MetricService } from '../metric/metric.service';
import { TimeUtilsService } from '../utils/time/timeUtils.service';

@Injectable()
export class RecordsService {
  constructor(
    private readonly dataService: DatabaseService,
    private readonly timeUtilsService: TimeUtilsService,
    private readonly metricService: MetricService,
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
            data: record.data.map((data) => ({
              value: data.value,
              created_at: new Date(),
              updated_at: new Date(),
              metric_id: data.metric_id,
            })),
          },
        },
      },
      include: {
        visit_record_metric: true,
        media: true,
        hospital: true,
      },
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

  async formatRecord(records, user): Promise<RecordResponse[]> {
    return await Promise.all(
      records.map(async (record) => {
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
      }),
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
    await this.dataService.Record.update({
      where: { visit_record_id: record.id },
      data: {
        visit_doctor_date: record.visit_doctor_date,
        next_visit_doctor_date: record.next_visit_doctor_date,
        doctor_name: record.doctor_name,
      },
    });

    if (record.data) {
      await this.dataService.Record.update({
        where: { visit_record_id: record.id },
        data: {
          visit_record_metric: {
            updateMany: record.data.map((data) => ({
              where: { metric_id: data.metric_id },
              data: {
                value: data.value,
              },
            })),
          },
        },
      });
    }

    if (record.hospital_id) {
      const check = await this.dataService.Hospital.findUnique({ where: { hospital_id: record.hospital_id } });
      if (!check) {
        throw new NotFoundException('Hospital not found');
      }

      await this.dataService.Record.update({
        where: { visit_record_id: record.id },
        data: {
          hospital: {
            connect: {
              hospital_id: record.hospital_id,
            },
          },
        },
      });
    }
    const formatRecord = await this.getRecordById(record.id);
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
}
