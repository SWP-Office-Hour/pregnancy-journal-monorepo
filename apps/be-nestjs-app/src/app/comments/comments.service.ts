import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentCreateRequestType, CommentType, CommentUpdateRequestType } from '../../../../../libs/contract/src/lib/comment.contract';
import { DatabaseService } from '../database/database.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly dataService: DatabaseService,
    private readonly postService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async createComment({ comment, user_id }: { comment: CommentCreateRequestType; user_id: string }): Promise<CommentType> {
    await this.postService.findOne(comment.post_id);
    await this.usersService.getUserById(user_id);
    return await this.dataService.Comment.create({
      data: {
        content: comment.content,
        created_at: new Date(),
        updated_at: new Date(),
        post: {
          connect: {
            post_id: comment.post_id,
          },
        },
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });
  }

  async getAllCommentsByPostId(post_id: string) {
    await this.postService.findOne(post_id);
    return await this.dataService.Comment.findMany({
      where: {
        post_id,
      },
    });
  }

  async updateComment(comment: CommentUpdateRequestType) {
    const result = await this.dataService.Comment.findUnique({
      where: {
        comment_id: comment.comment_id,
      },
    });
    if (!result) {
      throw new NotFoundException('Comment not found');
    }

    return await this.dataService.Comment.update({
      where: {
        comment_id: comment.comment_id,
      },
      data: {
        content: comment.content,
        updated_at: new Date(),
      },
    });
  }

  async deleteComment(comment_id: string) {
    const result = await this.dataService.Comment.findUnique({
      where: {
        comment_id,
      },
    });
    if (!result) {
      throw new NotFoundException('Comment not found');
    }

    return await this.dataService.Comment.delete({
      where: {
        comment_id,
      },
    });
  }
}
