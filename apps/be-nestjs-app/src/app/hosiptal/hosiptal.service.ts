import { Injectable } from '@nestjs/common';
import { CreateHosiptalDto } from './dto/create-hosiptal.dto';
import { UpdateHosiptalDto } from './dto/update-hosiptal.dto';

@Injectable()
export class HosiptalService {
  create(createHosiptalDto: CreateHosiptalDto) {
    return 'This action adds a new hosiptal';
  }

  findAll() {
    return `This action returns all hosiptal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hosiptal`;
  }

  update(id: number, updateHosiptalDto: UpdateHosiptalDto) {
    return `This action updates a #${id} hosiptal`;
  }

  remove(id: number) {
    return `This action removes a #${id} hosiptal`;
  }
}
