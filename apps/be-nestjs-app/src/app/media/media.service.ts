import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MediaService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(media_url: string) {
    return this.databaseService.Media.create({
      data: {
        media_url: media_url,
        created_at: new Date(),
      },
    });
  }

  findAll() {
    return this.databaseService.Media.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Media.findUnique({
      where: {
        id: id,
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
        id: id,
      },
    });

    return 'delete successfully';
  }
}
