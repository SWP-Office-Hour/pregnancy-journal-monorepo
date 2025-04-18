import { Body, Controller, Param } from '@nestjs/common';
import { metricContract, MetricCreateRequestType, MetricUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { MetricService } from './metric.service';

@Controller()
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @TsRestHandler(metricContract.create)
  handleCreate(@Body() createMetricDto: MetricCreateRequestType) {
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
      const result = await this.metricService.findOneWithStandard(id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(metricContract.update)
  handleUpdate(@Body() updateMetricDto: MetricUpdateRequestType) {
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
