import { Body, Controller, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { PostContract, PostCreateType, PostUpdateType } from '../../../../../libs/contract/src/lib/post.contract';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(PostContract.create)
  handleCreate(@Body() createPostDto: PostCreateType, @Req() req: RequestWithJWT) {
    return tsRestHandler(PostContract.create, async () => {
      const user = req.decoded_authorization?.user_id;
      if (!user) {
        throw new UnauthorizedException('Access token is invalid');
      }

      const post = await this.postsService.create(createPostDto, user);
      return {
        status: 200,
        body: post,
      };
    });
  }

  @TsRestHandler(PostContract.getAll)
  handleGetAll() {
    return tsRestHandler(PostContract.getAll, async () => {
      const posts = await this.postsService.findAll();
      return {
        status: 200,
        body: {
          total: posts.length,
          data: posts,
        },
      };
    });
  }

  @TsRestHandler(PostContract.getOne)
  handleGetOne(id: string) {
    return tsRestHandler(PostContract.getOne, async () => {
      const post = await this.postsService.findOne(id);
      return {
        status: 200,
        body: post,
      };
    });
  }

  @TsRestHandler(PostContract.update)
  handleUpdate(@Body() updatePostDto: PostUpdateType) {
    return tsRestHandler(PostContract.update, async () => {
      const post = await this.postsService.update(updatePostDto);
      return {
        status: 200,
        body: post,
      };
    });
  }

  @TsRestHandler(PostContract.delete)
  handleDelete(id: string) {
    return tsRestHandler(PostContract.delete, async () => {
      await this.postsService.remove(id);
      return {
        status: 200,
        body: {
          message: 'Delete successfully',
        },
      };
    });
  }
}
