import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordCreateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { MetricService } from '../metric/metric.service';
import { TimeUtilsService } from '../utils/time/timeUtils.service';

@Injectable()
export class RecordService {
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

    const result = await this.dataService.Record.findMany({
      where: {
        user_id: userId,
      },
      include: {
        visit_record_metric: {
          include: {
            metric: true,
          },
        },
        media: true,
        hospital: true,
      },
    });
    if (!result) {
      throw new NotFoundException('Record not found');
    }
    // const media_urls = result.map((r) => ({
    //   url: r.media.map((m) => m.media_url),
    // }));
    // const week = result.map((r) =>
    //   this.timeUtilsService.calculatePregnancyWeeks({
    //     expectedBirthDate: user.expected_birth_date,
    //     visitDate: r.visit_doctor_date,
    //   }),
    // );
    // const hospital = result.map((r) => r.hospital);
    // const data = result.map((r) =>
    //   r.visit_record_metric.map(
    //     async (m) => await this.metricService.findByMetricIdAndWeek({ metricId: m.metric_id, week: week }),
    //   ),
    // );

    return result.map((r) => ({
      id: r.id,
      week: this.timeUtilsService.calculatePregnancyWeeks({
        expectedBirthDate: user.expected_birth_date,
        visitDate: r.visit_doctor_date,
      }),
      visit_doctor_date: r.visit_doctor_date,
      next_visit_doctor_date: r.next_visit_doctor_date,
      hospital: r.hospital,
      user_id: r.user_id,
      data: r.visit_record_metric.map(async (m, week) => {
        const metric = await this.metricService.findByMetricIdAndWeek({ metricId: m.metric_id, week: week });
        return {
          value: m.value,
          metric_id: m.metric_id,
          metric_title: metric.title,
          metric_measure: metric.measurement_unit,
          metric_upperBoundMsg: metric.upperbound_msg,
          metric_lowerBoundMsg: metric.lowerbound_msg,
          standard_lowerbound: metric.standard ? metric.standard[0].lowerbound : undefined,
          standard_upperbound: metric.standard ? metric.standard[0].upperbound : undefined,
          standard_week: metric.standard ? metric.standard[0].week : undefined,
          whoStandardValue: metric.standard ? metric.standard[0].who_standard_value : undefined,
          tag: this.dataService.Tag.findUnique({
            where: {
              id: m.tag_id,
            },
          }),
          status: metric.status,
        };
      }),
      media: r.media,
    }));
  }
}
