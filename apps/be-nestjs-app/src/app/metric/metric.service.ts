import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MetricCreateRequestType,
  MetricResponseType,
  MetricUpdateRequestType,
  MetricWithStandardResponseType,
} from '@pregnancy-journal-monorepo/contract';
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

  async findAll(): Promise<MetricResponseType[]> {
    const metric = await this.databaseService.Metric.findMany();
    return Promise.all(
      metric.map(async (m) => {
        if (!m.tag_id) {
          return {
            metric_id: m.metric_id,
            title: m.title,
            measurement_unit: m.measurement_unit,
            status: m.status,
            required: m.required,
            upperbound_msg: m.upperbound_msg,
            lowerbound_msg: m.lowerbound_msg,
          };
        }
        const tag = await this.databaseService.Tag.findUnique({
          where: {
            tag_id: m.tag_id,
          },
        });
        if (!tag) {
          return {
            metric_id: m.metric_id,
            title: m.title,
            measurement_unit: m.measurement_unit,
            status: m.status,
            required: m.required,
            upperbound_msg: m.upperbound_msg,
            lowerbound_msg: m.lowerbound_msg,
          };
        }
        return {
          metric_id: m.metric_id,
          title: m.title,
          measurement_unit: m.measurement_unit,
          status: m.status,
          required: m.required,
          upperbound_msg: m.upperbound_msg,
          lowerbound_msg: m.lowerbound_msg,
          tag,
        };
      }),
    );
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

  async findOneWithStandard(id: string): Promise<MetricWithStandardResponseType> {
    const metricResult = await this.databaseService.Metric.findUnique({
      where: {
        metric_id: id,
      },
      include: {
        standard: true,
      },
    });
    if (!metricResult) {
      throw new NotFoundException('Metric not found');
    }
    return {
      metric_id: metricResult.metric_id,
      title: metricResult.title,
      measurement_unit: metricResult.measurement_unit,
      status: metricResult.status,
      required: metricResult.required,
      upperbound_msg: metricResult.upperbound_msg,
      lowerbound_msg: metricResult.lowerbound_msg,
      standardArray: metricResult.standard || [],
    };
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
    const deleted = await this.findOne(id);
    await this.databaseService.Standard.deleteMany({
      where: {
        metric_id: id,
      },
    });
    await this.databaseService.Metric.delete({
      where: {
        metric_id: id,
      },
    });
    return deleted;
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
