import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
