import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, DatabaseService],
})
export class ReminderModule {}
