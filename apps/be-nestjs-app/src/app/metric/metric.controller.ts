import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetricService } from './metric.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { metricContract, MetricCreateReq } from '@pregnancy-journal-monorepo/contract';

@Controller()
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @TsRestHandler(metricContract.create)
  handleCreate(@Body() createMetricDto: MetricCreateReq) {
    return tsRestHandler(metricContract.create, async () => {
      const result = await this.metricService.create(createMetricDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(metricContract.getAll)
  handleGetAll() {
    return tsRestHandler(metricContract.getAll, async () => {
      const result = await this.metricService.findAll();
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(metricContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(metricContract.getOne, async () => {
      const result = await this.metricService.findOne(id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(metricContract.update)
  handleUpdate(@Param('id') id: string, @Body() updateMetricDto: any) {
    return tsRestHandler(metricContract.update, async () => {
      const result = await this.metricService.update(updateMetricDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(metricContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(metricContract.delete, async () => {
      const result = await this.metricService.remove(id);
      return { status: 200, body: result };
    });
  }
}
