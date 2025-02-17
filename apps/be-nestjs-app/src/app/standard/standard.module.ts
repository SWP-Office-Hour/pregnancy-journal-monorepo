import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MetricModule } from '../metric/metric.module';
import { StandardController } from './standard.controller';
import { StandardService } from './standard.service';

@Module({
  imports: [MetricModule],
  controllers: [StandardController],
  providers: [StandardService, DatabaseService],
})
export class StandardModule {}
