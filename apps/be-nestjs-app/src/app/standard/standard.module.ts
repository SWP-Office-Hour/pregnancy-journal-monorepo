import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MetricModule } from '../metric/metric.module';
import { StandardController } from './standard.controller';
import { StandardService } from './standard.service';

@Module({
  imports: [MetricModule, DatabaseModule],
  controllers: [StandardController],
  providers: [StandardService],
  exports: [StandardService],
})
export class StandardModule {}
