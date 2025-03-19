import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RecordsModule } from '../records/records.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [UsersModule, JwtUtilsModule, RecordsModule, DatabaseModule],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [ChildService],
})
export class ChildModule {}
