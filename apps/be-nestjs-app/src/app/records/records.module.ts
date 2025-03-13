import { forwardRef, Module } from '@nestjs/common';
import { ChildModule } from '../child/child.module';
import { DatabaseService } from '../database/database.service';
import { MediaModule } from '../media/media.module';
import { MetricModule } from '../metric/metric.module';
import { ReminderModule } from '../reminder/reminder.module';
import { StandardService } from '../standard/standard.service';
import { TagModule } from '../tags/tag.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [JwtUtilsModule, MetricModule, TagModule, forwardRef(() => ChildModule), ReminderModule, MediaModule],
  controllers: [RecordsController],
  providers: [RecordsService, DatabaseService, TimeUtilsService, StandardService],
  exports: [RecordsService],
})
export class RecordsModule {}
