import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

@Module({
  imports: [UsersModule, JwtUtilsModule],
  controllers: [ReminderController],
  providers: [ReminderService, DatabaseService],
})
export class ReminderModule {}
