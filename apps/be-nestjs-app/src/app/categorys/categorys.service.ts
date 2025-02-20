import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryCreateRequest, CategoryUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategorysService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCategoryDto: CategoryCreateRequest) {
    return this.databaseService.Category.create({
      data: {
        status: createCategoryDto.status,
        title: createCategoryDto.title,
      },
    });
  }

  findAll() {
    return this.databaseService.Category.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Category.findUnique({
      where: {
        category_id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }

  async update(updateCategoryDto: CategoryUpdateRequest) {
    const cur = await this.findOne(updateCategoryDto.category_id);
    if (!cur) {
      throw new NotFoundException('Category not found');
    }
    return this.databaseService.Category.update({
      where: {
        category_id: updateCategoryDto.category_id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const cur = await this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Category not found');
    }
    return this.databaseService.Category.delete({
      where: {
        category_id: id,
      },
    });
  }
}
