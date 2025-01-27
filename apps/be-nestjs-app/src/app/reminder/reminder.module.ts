import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, DatabaseService]
})
export class ReminderModule {
}
