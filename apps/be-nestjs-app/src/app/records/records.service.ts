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

  //bản cũ chưa format
  // async getRecordByUserId(userId) {
  //   const user = await this.dataService.User.findUnique({
  //     where: { id: userId },
  //   });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //
  //   const result = await this.dataService.Record.findMany({
  //     where: {
  //       user_id: userId,
  //     },
  //     include: {
  //       visit_record_metric: true,
  //       media: true,
  //       hospital: true,
  //     },
  //   });
  //   if (!result) {
  //     throw new NotFoundException('Record not found');
  //   }
  //
  //   const re = result.map((r) => {
  //     return {
  //       id: r.id,
  //       week: this.timeUtilsService.calculatePregnancyWeeks({
  //         expectedBirthDate: user.expected_birth_date,
  //         visitDate: r.visit_doctor_date,
  //       }),
  //       visit_doctor_date: r.visit_doctor_date,
  //       next_visit_doctor_date: r.next_visit_doctor_date,
  //       hospital: r.hospital,
  //       user_id: r.user_id,
  //       data: r.visit_record_metric.map(async (m) => {
  //         const metric = await this.metricService.findByMetricIdAndWeek({
  //           metricId: m.metric_id,
  //           week: this.timeUtilsService.calculatePregnancyWeeks({
  //             expectedBirthDate: user.expected_birth_date,
  //             visitDate: r.visit_doctor_date,
  //           }),
  //         });
  //         console.log(metric);
  //         if (m.tag_id) {
  //           return {
  //             value: m.value,
  //             metric_id: m.metric_id,
  //             metric_title: metric.title,
  //             metric_measure: metric.measurement_unit,
  //             metric_upperBoundMsg: metric.upperbound_msg,
  //             metric_lowerBoundMsg: metric.lowerbound_msg,
  //             standard_lowerbound: metric.standard ? metric.standard[0].lowerbound : undefined,
  //             standard_upperbound: metric.standard ? metric.standard[0].upperbound : undefined,
  //             standard_week: metric.standard ? metric.standard[0].week : undefined,
  //             whoStandardValue: metric.standard ? metric.standard[0].who_standard_value : undefined,
  //             tag: await this.dataService.Tag.findUnique({
  //               where: {
  //                 id: m.tag_id,
  //               },
  //             }),
  //             status: metric.status,
  //           };
  //         }
  //
  //         return {
  //           value: m.value,
  //           metric_id: m.metric_id,
  //           metric_title: metric.title,
  //           metric_measure: metric.measurement_unit,
  //           metric_upperBoundMsg: metric.upperbound_msg,
  //           metric_lowerBoundMsg: metric.lowerbound_msg,
  //           standard_lowerbound: metric.standard ? metric.standard[0].lowerbound : undefined,
  //           standard_upperbound: metric.standard ? metric.standard[0].upperbound : undefined,
  //           standard_week: metric.standard ? metric.standard[0].week : undefined,
  //           whoStandardValue: metric.standard ? metric.standard[0].who_standard_value : undefined,
  //           tag: undefined,
  //           status: metric.status,
  //         };
  //       }),
  //       media: r.media,
  //     };
  //   });
  //
  //   return re;
  // }

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

    const formattedRecords = await Promise.all(
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

    return formattedRecords;
  }
}
