import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospitalController';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, DatabaseService],
})
export class HospitalModule {}
