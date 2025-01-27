import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HosiptalService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {
  }

  findAll() {
    return this.databaseService.Hospital.findMany();
  }

  findOne(id: string) {
    return this.databaseService.Hospital.findUnique({
      where: {
        id: id
      }
    });
  }
}
