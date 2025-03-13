import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../mail/mail.module';
import { ReminderModule } from '../reminder/reminder.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule, ReminderModule],
  providers: [ScheduleService],
})
export class ScheduleRemindModule {}
