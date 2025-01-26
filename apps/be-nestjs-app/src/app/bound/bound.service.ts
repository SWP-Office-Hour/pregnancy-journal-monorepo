import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoundService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService
  ) {}

  //
  // create(createBoundDto: CreateBoundDto) {
  //   return 'This action adds a new bound';
  // }
  //
  // findAll() {
  //   return `This action returns all bound`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} bound`;
  // }
  //
  // update(id: number, updateBoundDto: UpdateBoundDto) {
  //   return `This action updates a #${id} bound`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} bound`;
  // }
}
