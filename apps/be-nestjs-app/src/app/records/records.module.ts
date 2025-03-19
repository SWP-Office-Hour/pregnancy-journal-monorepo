import { forwardRef, Module } from '@nestjs/common';
import { ChildModule } from '../child/child.module';
import { DatabaseModule } from '../database/database.module';
import { MediaModule } from '../media/media.module';
import { MetricModule } from '../metric/metric.module';
import { ReminderModule } from '../reminder/reminder.module';
import { StandardModule } from '../standard/standard.module';
import { TagModule } from '../tags/tag.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { TimeUtilsService } from '../utils/time/timeUtils.service';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [
    JwtUtilsModule,
    MetricModule,
    TagModule,
    forwardRef(() => ChildModule),
    forwardRef(() => ReminderModule),
    MediaModule,
    StandardModule,
    DatabaseModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService, TimeUtilsService],
  exports: [RecordsService],
})
export class RecordsModule {}
