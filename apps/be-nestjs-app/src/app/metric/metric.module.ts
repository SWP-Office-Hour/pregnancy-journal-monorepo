import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { MetricController } from './metric.controller';

@Module({
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
