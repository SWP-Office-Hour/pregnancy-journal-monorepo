import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCreateType, PostType, PostUpdateType } from '../../../../../libs/contract/src/lib/post.contract';
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
        created_at: new Date(),
        updated_at: new Date(),
        user: {
          connect: { user_id: user_id },
        },
      },
    });
  }

  async findAll() {
    return await this.databaseService.Post.findMany();
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
        updated_at: new Date(),
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
