import { Injectable, NotFoundException } from '@nestjs/common';
import { MetricCreateReq, MetricUpdateReq } from '@pregnancy-journal-monorepo/contract';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { StandardService } from '../standard/standard.service';

@Injectable()
export class MetricService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly standardService: StandardService,
  ) {}

  async create(createMetricDto: MetricCreateReq) {
    return this.databaseService.Metric.create({
      data: {
        title: createMetricDto.title,
        measurement_unit: createMetricDto.measurement_unit,
        status: createMetricDto.status,
        required: createMetricDto.required,
        upperbound_msg: createMetricDto.upperBoundMsg,
        lowerbound_msg: createMetricDto.lowerBoundMsg,
        standard: {
          createMany: {
            data: createMetricDto.standard.map((bound) => {
              return {
                week: bound.week,
                upperbound: bound.upperbound,
                lowerbound: bound.lowerbound,
                who_standard_value: bound.whoStandardValue,
              };
            }),
          },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.Metric.findMany();
  }

  async findOne(id: string) {
    const cur = await this.databaseService.Metric.findUnique({
      where: {
        id: id,
      },
      include: {
        standard: true,
        visit_record_metric: true,
      },
    });
    if (!cur) {
      throw new NotFoundException('Metric not found');
    }
    return cur;
  }

  update(updateMetricDto: MetricUpdateReq) {
    const cur = this.findOne(updateMetricDto.id);
    if (!cur) {
      throw new NotFoundException('Metric not found');
    }
    return this.databaseService.Metric.update({
      where: {
        id: updateMetricDto.id,
      },
      data: updateMetricDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const deleteStandard = this.databaseService.Standard.deleteMany({
      where: {
        metric_id: id,
      },
    });

    const deleteMetric = this.databaseService.Metric.delete({
      where: {
        id: id,
      },
    });

    const prima = new PrismaClient();
    return prima.$transaction([deleteStandard, deleteMetric]);
  }

  async findByMetricIdAndWeek({ metricId, week }: { metricId: string; week: number }) {
    return await this.databaseService.Metric.findFirst({
      where: {
        id: metricId,
      },
      include: {
        standard: {
          where: {
            week: week,
          },
        },
      },
    });
  }
}
