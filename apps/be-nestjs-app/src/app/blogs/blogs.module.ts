import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
