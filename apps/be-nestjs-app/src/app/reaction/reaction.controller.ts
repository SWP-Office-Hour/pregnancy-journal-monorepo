import { Body, Controller, Param, Req, UseGuards } from '@nestjs/common';

import { reactionContract, ReactionRequestType } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { ReactionService } from './reaction.service';

@Controller()
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(reactionContract.createReaction)
  handleCreateOrDeleteReaction(@Req() req: RequestWithJWT, @Body() body: ReactionRequestType) {
    return tsRestHandler(reactionContract.createReaction, async () => {
      if (!req.decoded_authorization) {
        return { status: 401, body: { message: 'Unauthorized' } };
      }

      const result = await this.reactionService.createOrDeleteReaction(body.post_id, req.decoded_authorization.user_id);
      // Check which type of result was returned
      if ('message' in result) {
        // This is the { message: string } type
        console.log('Reaction was deleted:', result.message);
        return { status: 201, body: result };
      } else {
        // This is the ReactionResponseType
        console.log('Reaction was created with ID:', result.reaction_id);
        return { status: 200, body: result };
      }
    });
  }

  @TsRestHandler(reactionContract.getReactionByPostId)
  handleGetReactionByPostId(@Param('post_id') post_id: string) {
    return tsRestHandler(reactionContract.getReactionByPostId, async () => {
      if (!post_id) {
        return { status: 400, body: { message: 'No post_id provided' } };
      }
      const result = await this.reactionService.getReactionsByPostId(post_id);
      return {
        status: 200,
        body: {
          total_reactions: result.length,
          reactions: result,
        },
      };
    });
  }
}
