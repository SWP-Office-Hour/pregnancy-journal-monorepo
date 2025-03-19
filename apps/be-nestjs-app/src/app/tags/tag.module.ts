import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
