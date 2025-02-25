import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MetricModule } from '../metric/metric.module';
import { ReminderModule } from '../reminder/reminder.module';
import { StandardService } from '../standard/standard.service';
import { TagModule } from '../tags/tag.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [JwtUtilsModule, MetricModule, TagModule, UsersModule, ReminderModule],
  controllers: [RecordsController],
  providers: [RecordsService, DatabaseService, TimeUtilsService, StandardService],
})
export class RecordsModule {}
