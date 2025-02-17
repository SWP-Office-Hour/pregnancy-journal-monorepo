import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TagModule } from '../tags/tag.module';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  imports: [TagModule],
  controllers: [MetricController],
  providers: [MetricService, DatabaseService],
  exports: [MetricService],
})
export class MetricModule {}
