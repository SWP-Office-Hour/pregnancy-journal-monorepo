import { Body, Controller, Param, Query } from '@nestjs/common';
import { blogContract, BlogCreateReq, BlogUpdateReq } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { BlogsService } from './blogs.service';

@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @TsRestHandler(blogContract.create)
  handleCreate(@Body() createBlogDto: BlogCreateReq) {
    return tsRestHandler(blogContract.create, async () => {
      const result = await this.blogsService.create(createBlogDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(blogContract.getAll)
  handleGetAll(@Query('page') page: number, @Query('limit') limit: number) {
    return tsRestHandler(blogContract.getAll, async () => {
      page = page ? page : 1;
      limit = limit ? limit : 10;

      const result = await this.blogsService.findAll(page, limit);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(blogContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(blogContract.getOne, async () => {
      const result = await this.blogsService.findOne(id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(blogContract.update)
  handleUpdate(@Body() updateBlogDto: BlogUpdateReq) {
    return tsRestHandler(blogContract.update, async () => {
      const result = await this.blogsService.update(updateBlogDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(blogContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(blogContract.delete, async () => {
      const result = await this.blogsService.remove(id);
      return { status: 200, body: result };
    });
  }
}
