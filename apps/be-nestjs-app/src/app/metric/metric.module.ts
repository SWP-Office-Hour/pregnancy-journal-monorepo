import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TagModule } from '../tags/tag.module';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  imports: [TagModule, DatabaseModule],
  controllers: [MetricController],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {}
