import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RecordsModule } from '../records/records.module';
import { ReminderModule } from '../reminder/reminder.module';
import { ReminderService } from '../reminder/reminder.service';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [ReminderModule, forwardRef(() => UsersModule), JwtUtilsModule, RecordsModule, DatabaseModule],
  controllers: [ChildController],
  providers: [ChildService, ReminderService],
  exports: [ChildService],
})
export class ChildModule {}
