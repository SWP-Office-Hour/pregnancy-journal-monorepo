import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @TsRestHandler(commentContract.create)
  // handleCreate(@Body() createCommentDto: CommentCreateRequest) {
  //   return tsRestHandler(commentContract.create, async () => {
  //     const result = await this.commentsService.createComment(createCommentDto);
  //     return { status: 200, body: result };
  //   });
  // }
}
