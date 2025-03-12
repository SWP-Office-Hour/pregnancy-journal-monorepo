import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersModule } from '../users/users.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [UsersModule],
  controllers: [ChildController],
  providers: [ChildService, DatabaseService],
  exports: [ChildService],
})
export class ChildModule {}
