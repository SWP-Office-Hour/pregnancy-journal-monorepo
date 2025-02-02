import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [TagController],
  providers: [TagService, DatabaseService],
})
export class TagModule {}
