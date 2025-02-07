import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';

@Module({
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
