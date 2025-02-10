import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordCreateRequest } from '@pregnancy-journal-monorepo/contract';
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
  async createRecord({ record, userId }: { record: RecordCreateRequest; userId: string }) {
    const hospitalId = record.hospital_id;
    record.hospital_id = undefined;
    const createRecord = {
      visit_doctor_date: record.visit_doctor_date,
      next_visit_doctor_date: record.next_visit_doctor_date,
      doctor_name: record.doctor_name,
      created_at: new Date(),
    };

    return await this.dataService.Record.create({
      data: {
        ...createRecord,
        user: {
          connect: {
            id: userId,
          },
        },
        created_at: new Date(),
        hospital: {
          connect: {
            id: hospitalId,
          },
        },
      },
    });
  }

  async getRecordByUserId(userId: string) {
    const user = await this.dataService.User.findUnique({
      where: { id: userId },
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

    // const formattedRecords = await Promise.all(
    //   records.map(async (record) => {
    //     const week = this.timeUtilsService.calculatePregnancyWeeks({
    //       expectedBirthDate: user.expected_birth_date,
    //       visitDate: record.visit_doctor_date,
    //     });
    //
    //     const data = await Promise.all(
    //       record.visit_record_metric.map(async (metricRecord) => {
    //         const metric = await this.metricService.findByMetricIdAndWeek({
    //           metricId: metricRecord.metric_id,
    //           week,
    //         });
    //
    //         const tag = metricRecord.tag_id
    //           ? await this.dataService.Tag.findUnique({
    //               where: { id: metricRecord.tag_id },
    //             })
    //           : undefined;
    //
    //         return {
    //           value: metricRecord.value,
    //           metric_id: metricRecord.metric_id,
    //           metric_title: metric.title,
    //           metric_measure: metric.measurement_unit,
    //           metric_upperBoundMsg: metric.upperbound_msg,
    //           metric_lowerBoundMsg: metric.lowerbound_msg,
    //           standard_lowerbound: metric.standard?.[0]?.lowerbound,
    //           standard_upperbound: metric.standard?.[0]?.upperbound,
    //           standard_week: metric.standard?.[0]?.week,
    //           whoStandardValue: metric.standard?.[0]?.who_standard_value,
    //           tag,
    //           status: metric.status,
    //         };
    //       }),
    //     );
    //
    //     return {
    //       id: record.id,
    //       week,
    //       visit_doctor_date: record.visit_doctor_date,
    //       next_visit_doctor_date: record.next_visit_doctor_date,
    //       hospital: record.hospital,
    //       user_id: record.user_id,
    //       data,
    //       media: record.media,
    //     };
    //   }),
    // );

    return await this.formatRecord(records, user);
  }

  async formatRecord(records, user) {
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
                  where: { id: metricRecord.tag_id },
                })
              : undefined;

            return {
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
          }),
        );

        return {
          id: record.id,
          week,
          visit_doctor_date: record.visit_doctor_date,
          next_visit_doctor_date: record.next_visit_doctor_date,
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
      where: { id: recordId },
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
      where: { id: record.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.formatRecord([record], user);
  }
}
