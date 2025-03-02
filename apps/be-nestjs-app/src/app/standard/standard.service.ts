import { Injectable, NotFoundException } from '@nestjs/common';
import { Standard, StandardCreateRequest, StandardUpdateReq } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { MetricService } from '../metric/metric.service';

@Injectable()
export class StandardService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly metricService: MetricService,
  ) {}

  async create(createStandardDto: StandardCreateRequest) {
    const metric = await this.metricService.findOne(createStandardDto.metric_id);

    if (!metric) {
      throw new NotFoundException('Metric not found');
    }

    return this.databaseService.Standard.create({
      data: {
        week: createStandardDto.week,
        upperbound: createStandardDto.upperbound,
        lowerbound: createStandardDto.lowerbound,
        who_standard_value: createStandardDto.who_standard_value,
        metric: {
          connect: {
            metric_id: createStandardDto.metric_id,
          },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.Standard.findMany();
  }

  findOne(id: string) {
    return this.databaseService.Standard.findUnique({
      where: {
        standard_id: id,
      },
    });
  }

  async findStandardByMetricId(id: string): Promise<Standard[]> {
    await this.metricService.findOne(id);

    const result = await this.databaseService.Metric.findUnique({
      include: {
        standard: true,
      },
      where: {
        metric_id: id,
      },
    });

    if (!result) {
      return [];
    }

    return result.standard;
  }

  update(updateStandardDto: StandardUpdateReq) {
    const cur = this.findOne(updateStandardDto.standard_id);
    if (!cur) {
      throw new NotFoundException('Standard not found');
    }

    return this.databaseService.Standard.update({
      where: {
        standard_id: updateStandardDto.standard_id,
      },
      data: updateStandardDto,
    });
  }

  remove(id: string) {
    const cur = this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Standard not found');
    }
    return this.databaseService.Standard.delete({
      where: {
        standard_id: id,
      },
    });
  }
}
