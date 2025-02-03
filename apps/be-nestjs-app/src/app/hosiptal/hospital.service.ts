import { Injectable, NotFoundException } from '@nestjs/common';
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
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Hospital not found');
    }
    return result;
  }
}
