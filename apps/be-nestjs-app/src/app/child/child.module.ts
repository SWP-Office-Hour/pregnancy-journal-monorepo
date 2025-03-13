import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RecordsModule } from '../records/records.module';
import { UsersModule } from '../users/users.module';
import { JwtUtilsModule } from '../utils/jwt/jwtUtils.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [UsersModule, JwtUtilsModule, RecordsModule],
  controllers: [ChildController],
  providers: [ChildService, DatabaseService],
  exports: [ChildService],
})
export class ChildModule {}
