import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
