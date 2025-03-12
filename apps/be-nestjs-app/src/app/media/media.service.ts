import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { FileService } from '../file/file.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileService: FileService,
  ) {}

  async updateWithRecordId({ media, record_id }: { media: MediaResponse[]; record_id?: string }) {
    const record = await this.databaseService.Record.findUnique({
      where: {
        visit_record_id: record_id,
      },
    });
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const mediaOfRecord = await this.databaseService.Media.findMany({
      where: {
        visit_record_id: record_id,
      },
    });

    const deletedMedias = mediaOfRecord.filter((m) => !media.find((m2) => m2.media_id === m.media_id));
    const newMedias = media.filter((m) => !mediaOfRecord.find((m2) => m2.media_id === m.media_id));

    return { newMedias, deletedMedias };
  }

  async createWithPostId({ media_url, post_id }: { media_url: string; post_id: string }) {
    const post = this.databaseService.Post.findUnique({
      where: {
        post_id: post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.databaseService.Media.create({
      data: {
        media_url: media_url,
        created_at: new Date(Date.now()),
        post: {
          connect: { post_id: post_id },
        },
      },
    });
  }

  async createWithRecordId({ media_url, record_id }: { media_url: string; record_id: string }) {
    const record = await this.databaseService.Record.findUnique({
      where: {
        visit_record_id: record_id,
      },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return await this.databaseService.Media.create({
      data: {
        media_url: media_url,
        created_at: new Date(Date.now()),
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
        media_id: id,
      },
      include: {
        post: true,
        visit_record: true,
      },
    });
    if (!result) {
      throw new NotFoundException('Media not found');
    }
    const imgLink = await this.fileService.getImageUrl(result.media_url);

    return { media: result, imgLink: imgLink };
  }

  async remove(id: string) {
    const result = await this.databaseService.Media.findUnique({
      where: {
        media_id: id,
      },
    });

    if (!result) {
      throw new NotFoundException('Media not found');
    }

    await this.fileService.deleteFile(result.media_url);
    return await this.databaseService.Media.delete({
      where: {
        media_id: id,
      },
    });
  }
}
