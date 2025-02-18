import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalCreateRequestType, HospitalUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HospitalService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.Hospital.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Hospital.findUnique({
      where: {
        hospital_id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Hospital not found');
    }
    return result;
  }

  async create(hospital: HospitalCreateRequestType) {
    return this.databaseService.Hospital.create({
      data: hospital,
    });
  }

  async update(hospital: HospitalUpdateRequestType) {
    const result = await this.findOne(hospital.hospital_id);
    if (!result) {
      throw new NotFoundException('Hospital not found');
    }
    return this.databaseService.Hospital.update({
      where: {
        hospital_id: hospital.hospital_id,
      },
      data: hospital,
    });
  }
}
