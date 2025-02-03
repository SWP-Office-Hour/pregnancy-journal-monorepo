import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [CategorysController],
  providers: [CategorysService, DatabaseService],
})
export class CategorysModule {}
