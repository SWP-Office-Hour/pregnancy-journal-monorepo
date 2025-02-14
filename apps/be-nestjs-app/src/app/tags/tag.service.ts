import { Injectable, NotFoundException } from '@nestjs/common';
import { TagCreateRequest, TagUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TagService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createTagDto: TagCreateRequest) {
    return this.databaseService.Tag.create({
      data: {
        title: createTagDto.title,
        status: createTagDto.status,
      },
    });
  }

  findAll() {
    return this.databaseService.Tag.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Tag.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Tag not found');
    }
    return result;
  }

  update(updateTagDto: TagUpdateRequest) {
    const cur = this.findOne(updateTagDto.id);
    if (!cur) {
      throw new NotFoundException('Tag not found');
    }
    return this.databaseService.Tag.update({
      where: {
        id: updateTagDto.id,
      },
      data: updateTagDto,
    });
  }

  remove(id: string) {
    const cur = this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Tag not found');
    }
    return this.databaseService.Tag.delete({
      where: {
        id: id,
      },
    });
  }
}
