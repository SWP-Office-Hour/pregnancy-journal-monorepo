import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, DatabaseService],
})
export class MediaModule {}
