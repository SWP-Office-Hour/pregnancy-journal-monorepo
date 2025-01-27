import { Module } from '@nestjs/common';
import { HosiptalService } from './hosiptal.service';
import { HosiptalController } from './hosiptal.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [HosiptalController],
  providers: [HosiptalService, DatabaseService]
})
export class HosiptalModule {
}
