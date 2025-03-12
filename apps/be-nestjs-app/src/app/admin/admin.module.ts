import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
  providers: [AdminService, DatabaseService],
})
export class AdminModule {}
