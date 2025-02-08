import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';

@Module({
  controllers: [CategorysController],
  providers: [CategorysService, DatabaseService],
})
export class CategorysModule {}
