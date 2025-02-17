import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MetricModule } from '../metric/metric.module';
import { MetricService } from '../metric/metric.service';
import { StandardService } from '../standard/standard.service';
import { TagModule } from '../tags/tag.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [JwtUtilsModule, MetricModule, TagModule],
  controllers: [RecordsController],
  providers: [RecordsService, DatabaseService, MetricService, TimeUtilsService, StandardService],
})
export class RecordsModule {}
