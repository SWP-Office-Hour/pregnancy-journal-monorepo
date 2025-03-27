import { Body, Controller, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { postContract, PostCreateType, PostType, PostUpdateType } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(postContract.create)
  handleCreate(@Body() createPostDto: PostCreateType, @Req() req: RequestWithJWT) {
    return tsRestHandler(postContract.create, async () => {
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

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(postContract.getPostByUserId)
  handleGetPostByUserId(@Req() req: RequestWithJWT) {
    return tsRestHandler(postContract.getPostByUserId, async () => {
      const user = req.decoded_authorization?.user_id;
      if (!user) {
        throw new UnauthorizedException('Access token is invalid');
      }

      const posts: PostType[] = await this.postsService.getPostByUserId(user);
      return {
        status: 200,
        body: {
          total: posts.length,
          data: posts,
        },
      };
    });
  }

  @TsRestHandler(postContract.getAll)
  handleGetAll(@Query('page') page: number, @Query('limit') limit: number) {
    return tsRestHandler(postContract.getAll, async () => {
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const total = await this.postsService.count();
      const posts = await this.postsService.findAll(page, limit);
      return {
        status: 200,
        body: {
          total: total,
          data: posts,
        },
      };
    });
  }

  @TsRestHandler(postContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(postContract.getOne, async () => {
      const post = await this.postsService.findOne(id);
      return {
        status: 200,
        body: post,
      };
    });
  }

  @TsRestHandler(postContract.update)
  handleUpdate(@Body() updatePostDto: PostUpdateType) {
    return tsRestHandler(postContract.update, async () => {
      const post = await this.postsService.update(updatePostDto);
      return {
        status: 200,
        body: post,
      };
    });
  }

  @TsRestHandler(postContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(postContract.delete, async () => {
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
