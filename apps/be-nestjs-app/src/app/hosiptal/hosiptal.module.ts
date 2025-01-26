import { Module } from '@nestjs/common';
import { HosiptalService } from './hosiptal.service';
import { HosiptalController } from './hosiptal.controller';

@Module({
  controllers: [HosiptalController],
  providers: [HosiptalService],
})
export class HosiptalModule {}
