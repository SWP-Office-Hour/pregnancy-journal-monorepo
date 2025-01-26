import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MetricService } from './metric.service';

@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  // @Post()
  // create(@Body() createMetricDto: CreateMetricDto) {
  //   return this.metricService.create(createMetricDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.metricService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.metricService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMetricDto: UpdateMetricDto) {
  //   return this.metricService.update(+id, updateMetricDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.metricService.remove(+id);
  // }
}
