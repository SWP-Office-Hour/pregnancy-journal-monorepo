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

  async count(): Promise<number> {
    return await this.databaseService.Post.count();
  }

  async create(createPostDto: PostCreateType, user_id: string): Promise<PostType> {
    await this.userService.getUserById(user_id);

    const createdPost = await this.databaseService.Post.create({
      data: {
        content: createPostDto.content,
        updated_at: new Date(Date.now()),
        created_at: new Date(Date.now()),
        user: {
          connect: { user_id: user_id },
        },
      },
    });

    return await this.findOne(createdPost.post_id);
  }

  async findAll(page: number, limit: number): Promise<PostType[]> {
    return await this.databaseService.Post.findMany({
      skip: page == 0 ? Number(page) : (page - 1) * limit,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
      include: {
        media: {
          select: {
            media_id: true,
            media_url: true,
          },
        },
        comment: {
          select: {
            comment_id: true,
            content: true,
            created_at: true,
            updated_at: true,
            user: {
              select: {
                user_id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        reaction: {
          select: {
            reaction_id: true,
            user: {
              select: {
                user_id: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            user_id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<PostType> {
    const post = await this.databaseService.Post.findUnique({
      where: {
        post_id: id,
      },
      include: {
        media: {
          select: {
            media_id: true,
            media_url: true,
          },
        },
        comment: {
          select: {
            comment_id: true,
            content: true,
            created_at: true,
            updated_at: true,
            user: {
              select: {
                user_id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        reaction: {
          select: {
            reaction_id: true,
            user: {
              select: {
                user_id: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            user_id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(updatePostDto: PostUpdateType): Promise<PostType> {
    await this.findOne(updatePostDto.post_id);

    const updatedPost = await this.databaseService.Post.update({
      where: {
        post_id: updatePostDto.post_id,
      },
      data: {
        content: updatePostDto.content,
        updated_at: new Date(Date.now()),
      },
    });

    return await this.findOne(updatedPost.post_id);
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
