import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RecordsModule } from '../records/records.module';
import { ReminderModule } from '../reminder/reminder.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [forwardRef(() => UsersModule), JwtUtilsModule, RecordsModule, DatabaseModule, ReminderModule],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [ChildService],
})
export class ChildModule {}
