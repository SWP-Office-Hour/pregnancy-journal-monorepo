import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, DatabaseService],
})
export class BlogsModule {}
