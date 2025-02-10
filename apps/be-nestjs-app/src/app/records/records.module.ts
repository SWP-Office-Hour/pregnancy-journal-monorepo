import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MetricService } from '../metric/metric.service';
import { StandardService } from '../standard/standard.service';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [JwtUtilsModule],
  controllers: [RecordsController],
  providers: [RecordsService, DatabaseService, MetricService, TimeUtilsService, StandardService],
})
export class RecordsModule {}
