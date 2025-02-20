import { Injectable, NotFoundException } from '@nestjs/common';
import { TagCreateRequest, TagResponse, TagUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TagService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createTagDto: TagCreateRequest): Promise<TagResponse> {
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
        tag_id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Tag not found');
    }
    return result;
  }

  update(updateTagDto: TagUpdateRequest) {
    const cur = this.findOne(updateTagDto.tag_id);
    if (!cur) {
      throw new NotFoundException('Tag not found');
    }
    return this.databaseService.Tag.update({
      where: {
        tag_id: updateTagDto.tag_id,
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
        tag_id: id,
      },
    });
  }
}
