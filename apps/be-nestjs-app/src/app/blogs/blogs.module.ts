import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, DatabaseService],
})
export class BlogsModule {}
