import { Body, Controller, Param } from '@nestjs/common';
import { categoryContract, CategoryCreateReq } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { CategorysService } from './categorys.service';

@Controller()
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @TsRestHandler(categoryContract.create)
  handleCreate(@Body() createCategoryDto: CategoryCreateReq) {
    return tsRestHandler(categoryContract.create, async () => {
      const result = await this.categorysService.create(createCategoryDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(categoryContract.getAll)
  handleGetAll() {
    return tsRestHandler(categoryContract.getAll, async () => {
      const result = await this.categorysService.findAll();
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(categoryContract.getOne)
  handleGetOne(@Param('id') id: string) {
    return tsRestHandler(categoryContract.getOne, async () => {
      const result = await this.categorysService.findOne(id);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(categoryContract.update)
  handleUpdate(@Body() updateCategoryDto: CategoryCreateReq) {
    return tsRestHandler(categoryContract.update, async () => {
      const result = await this.categorysService.update(updateCategoryDto);
      return { status: 200, body: result };
    });
  }

  @TsRestHandler(categoryContract.delete)
  handleDelete(@Param('id') id: string) {
    return tsRestHandler(categoryContract.delete, async () => {
      const result = await this.categorysService.remove(id);
      return { status: 200, body: result };
    });
  }
}
