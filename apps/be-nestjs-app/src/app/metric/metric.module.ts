import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { MetricController } from './metric.controller';
import { DatabaseService } from '../database/database.service';
import { StandardService } from '../standard/standard.service';

@Module({
  controllers: [MetricController],
  providers: [MetricService, DatabaseService, StandardService],
})
export class MetricModule {}
