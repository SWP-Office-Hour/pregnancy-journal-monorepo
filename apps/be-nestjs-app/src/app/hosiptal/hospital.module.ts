import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, DatabaseService],
})
export class HospitalModule {}
