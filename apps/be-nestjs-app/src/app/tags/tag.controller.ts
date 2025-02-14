import { Body, Controller, Param } from '@nestjs/common';
import { tagContract, TagCreateRequest, TagUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @TsRestHandler(tagContract.create)
  handleCreate(@Body() createTagDto: TagCreateRequest) {
    return tsRestHandler(tagContract.create, async () => {
      const result = await this.tagService.create(createTagDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(tagContract.getAll)
  handleGetAll() {
    return tsRestHandler(tagContract.getAll, async () => {
      const result = await this.tagService.findAll();
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(tagContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(tagContract.getOne, async () => {
      const result = await this.tagService.findOne(id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(tagContract.update)
  handleUpdate(@Body() updateTagDto: TagUpdateRequest) {
    return tsRestHandler(tagContract.update, async () => {
      const result = await this.tagService.update(updateTagDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(tagContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(tagContract.delete, async () => {
      const result = await this.tagService.remove(id);
      return { status: 200, body: result };
    });
  }
}
