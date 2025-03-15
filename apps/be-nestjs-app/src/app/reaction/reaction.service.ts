import { Injectable, NotFoundException } from '@nestjs/common';

import { ReactionResponseType } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createOrDeleteReaction(post_id: string, user_id: string): Promise<ReactionResponseType | { message: string }> {
    const post = await this.databaseService.Post.findUnique({
      where: {
        post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.databaseService.User.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reaction = await this.databaseService.Reaction.findMany({
      where: {
        post_id: post_id,
        user_id: user_id,
      },
    });

    if (reaction.length === 0) {
      return await this.databaseService.Reaction.create({
        data: {
          post: {
            connect: {
              post_id,
            },
          },
          user: {
            connect: {
              user_id,
            },
          },
        },
      });
    } else {
      await this.databaseService.Reaction.deleteMany({
        where: {
          post_id: post_id,
          user_id: user_id,
        },
      });
      return { message: 'Deleted' };
    }
  }

  async getReactionsByPostId(post_id: string): Promise<ReactionResponseType[]> {
    return await this.databaseService.Reaction.findMany({
      where: {
        post_id,
      },
    });
  }
}
