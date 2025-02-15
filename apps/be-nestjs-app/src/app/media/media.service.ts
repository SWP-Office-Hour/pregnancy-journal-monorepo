import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MediaService {
  constructor(private readonly databaseService: DatabaseService) {}

  createWithPostId({ media_url, post_id }: { media_url: string; post_id: string }) {
    return this.databaseService.Media.create({
      data: {
        media_url: media_url,
        created_at: new Date(),
        post: {
          connect: { post_id: post_id },
        },
      },
    });
  }

  createWithRecordId({ media_url, record_id }: { media_url: string; record_id: string }) {
    return this.databaseService.Media.create({
      data: {
        media_url: media_url,
        created_at: new Date(),
        visit_record: {
          connect: { visit_record_id: record_id },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.Media.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Media.findUnique({
      where: {
        media_id: i,
      },
      include: {
        post: true,
        visit_record: true,
      },
    });
    if (!result) {
      throw new NotFoundException('Media not found');
    }
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.databaseService.Media.delete({
      where: {
        media_id: id,
      },
    });

    return 'delete successfully';
  }
}
