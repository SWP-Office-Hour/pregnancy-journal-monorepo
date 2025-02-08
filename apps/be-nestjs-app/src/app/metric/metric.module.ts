import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StandardService } from '../standard/standard.service';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  controllers: [MetricController],
  providers: [MetricService, DatabaseService, StandardService],
})
export class MetricModule {}
