import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, DatabaseService],
})
export class AdminModule {}
