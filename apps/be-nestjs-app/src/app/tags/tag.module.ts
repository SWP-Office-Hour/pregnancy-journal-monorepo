import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService, DatabaseService],
  exports: [TagService],
})
export class TagModule {}
