import { Body, Controller, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { commentContract, CommentCreateRequestType, CommentUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(commentContract.create)
  handleCreate(@Body() createCommentDto: CommentCreateRequestType, @Req() req: RequestWithJWT) {
    return tsRestHandler(commentContract.create, async () => {
      if (!req.decoded_authorization) {
        throw new NotFoundException('Token is invalid');
      }
      const user_id = req.decoded_authorization.user_id;

      const result = await this.commentsService.createComment({ comment: createCommentDto, user_id: user_id });
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(commentContract.getAll)
  handleGetAll(@Param('post_id') post_id: string) {
    return tsRestHandler(commentContract.getAll, async () => {
      const result = await this.commentsService.getAllCommentsByPostId(post_id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(commentContract.update)
  handleUpdate(@Body() updateCommentDto: CommentUpdateRequestType) {
    return tsRestHandler(commentContract.update, async () => {
      const result = await this.commentsService.updateComment(updateCommentDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(commentContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(commentContract.delete, async () => {
      const result = await this.commentsService.deleteComment(id);
      return { status: 200, body: result };
    });
  }
}
