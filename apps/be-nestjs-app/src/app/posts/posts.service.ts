import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCreateType, PostType, PostUpdateType } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UsersService,
  ) {}

  async create(createPostDto: PostCreateType, user_id: string): Promise<PostType> {
    await this.userService.getUserById(user_id);

    return await this.databaseService.Post.create({
      data: {
        content: createPostDto.content,
        updated_at: new Date(Date.now()),
        created_at: new Date(Date.now()),
        user: {
          connect: { user_id: user_id },
        },
      },
    });
  }

  async findAll(page: number, limit: number): Promise<PostType[]> {
    return await this.databaseService.Post.findMany({
      skip: page == 0 ? Number(page) : (page - 1) * limit,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<PostType> {
    const post = await this.databaseService.Post.findUnique({
      where: {
        post_id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(updatePostDto: PostUpdateType) {
    await this.findOne(updatePostDto.post_id);

    return await this.databaseService.Post.update({
      where: {
        post_id: updatePostDto.post_id,
      },
      data: {
        content: updatePostDto.content,
        updated_at: new Date(Date.now()),
      },
    });
  }

  //tạm trc rồi thêm xóa comment react vs media sau
  async remove(id: string) {
    await this.findOne(id);
    await this.databaseService.Post.delete({
      where: {
        post_id: id,
      },
    });
  }
}
