import { Injectable, NotFoundException } from '@nestjs/common';
import { MetricCreateRequestType, MetricResponseType, MetricUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { TagService } from '../tags/tag.service';

@Injectable()
export class MetricService {
  constructor(
    private readonly databaseService: DatabaseService,
    // private readonly standardService: StandardService,
    private readonly tagService: TagService,
  ) {}

  async create(createMetricDto: MetricCreateRequestType): Promise<MetricResponseType> {
    // if (createMetricDto.standard) {
    //   return this.databaseService.Metric.create({
    //     data: {
    //       title: createMetricDto.title,
    //       measurement_unit: createMetricDto.measurement_unit,
    //       status: createMetricDto.status,
    //       required: createMetricDto.required,
    //       upperbound_msg: createMetricDto.upperbound_msg,
    //       lowerbound_msg: createMetricDto.lowerbound_msg,
    //       // standard: {
    //       //   createMany: {
    //       //     data: createMetricDto.standard.map((bound) => {
    //       //       return {
    //       //         week: bound.week,
    //       //         upperbound: bound.upperbound,
    //       //         lowerbound: bound.lowerbound,
    //       //         who_standard_value: bound.who_standard_value,
    //       //       };
    //       //     }),
    //       //   },
    //       // },
    //     },
    //   });
    // } else {

    let metric = await this.databaseService.Metric.create({
      data: {
        title: createMetricDto.title,
        measurement_unit: createMetricDto.measurement_unit,
        status: createMetricDto.status,
        required: createMetricDto.required,
        upperbound_msg: createMetricDto.upperbound_msg,
        lowerbound_msg: createMetricDto.lowerbound_msg,
      },
    });

    if (createMetricDto.tag_id) {
      const tag = await this.tagService.findOne(createMetricDto.tag_id);
      metric = await this.databaseService.Metric.update({
        where: {
          metric_id: metric.metric_id,
        },
        data: {
          tag: {
            connect: {
              tag_id: tag.tag_id,
            },
          },
        },
      });
    }

    return metric;
  }

  findAll() {
    return this.databaseService.Metric.findMany();
  }

  async findOne(id: string) {
    const cur = await this.databaseService.Metric.findUnique({
      where: {
        metric_id: id,
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

  async update(updateMetricDto: MetricUpdateRequestType) {
    const cur = await this.findOne(updateMetricDto.metric_id);
    if (!cur) {
      throw new NotFoundException('Metric not found');
    }
    const tag = updateMetricDto.tag_id;
    if (tag) {
      await this.tagService.findOne(tag); // check if tag exists
    }
    updateMetricDto.tag_id = undefined;

    let metric = await this.databaseService.Metric.update({
      where: {
        metric_id: updateMetricDto.metric_id,
      },
      data: updateMetricDto,
    });

    if (tag) {
      metric = await this.databaseService.Metric.update({
        where: {
          metric_id: updateMetricDto.metric_id,
        },
        data: {
          tag: {
            connect: {
              tag_id: tag,
            },
          },
        },
      });
    }
    return metric;
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
        metric_id: id,
      },
    });

    const prima = new PrismaClient();
    return prima.$transaction([deleteStandard, deleteMetric]);
  }

  async findByMetricIdAndWeek({ metricId, week }: { metricId: string; week: number }) {
    return await this.databaseService.Metric.findFirst({
      where: {
        metric_id: metricId,
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
