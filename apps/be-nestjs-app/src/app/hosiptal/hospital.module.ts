import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospitalController';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, DatabaseService],
})
export class HospitalModule {}
