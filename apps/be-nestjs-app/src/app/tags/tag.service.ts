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

  async findAllByUser(userId: string): Promise<TagResponse[]> {
    const user = await this.databaseService.User.findUnique({
      where: { user_id: userId },
      include: {
        visit_record: {
          orderBy: {
            visit_doctor_date: 'asc',
          },
          include: {
            visit_record_metric: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const lastRecord = user.visit_record[user.visit_record.length - 1];

    if (!lastRecord) {
      return [];
    }

    const tags_id = lastRecord.visit_record_metric.map((metric) => metric.tag_id).filter((tag_id) => tag_id !== null);

    const tags = await Promise.all(tags_id.map((tag_id) => this.databaseService.Tag.findUnique({ where: { tag_id } })));

    return tags.filter((tag): tag is TagResponse => tag !== null);
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
