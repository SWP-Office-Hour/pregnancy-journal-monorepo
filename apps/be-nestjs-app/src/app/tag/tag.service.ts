import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TagCreateReq, TagUpdateReq } from '@pregnancy-journal-monorepo/contract';

@Injectable()
export class TagService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createTagDto: TagCreateReq) {
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

  findOne(id: string) {
    const result = this.databaseService.Tag.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Tag not found');
    }
    return result;
  }

  update(updateTagDto: TagUpdateReq) {
    const cur = this.findOne(updateTagDto.id);
    if (!cur) {
      throw new NotFoundException('Tag not found');
    }

    const updateData = {
      title: updateTagDto.title,
      status: updateTagDto.status,
    };

    // Xóa các trường có giá trị null hoặc rỗng
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === null || updateData[key] === '') {
        delete updateData[key];
      }
    });

    return this.databaseService.Tag.update({
      where: {
        id: updateTagDto.id,
      },
      data: updateData,
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
