import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryCreateReq, CategoryUpdateReq } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategorysService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCategoryDto: CategoryCreateReq) {
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
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }

  async update(updateCategoryDto: CategoryUpdateReq) {
    const cur = await this.findOne(updateCategoryDto.id);
    if (!cur) {
      throw new NotFoundException('Category not found');
    }
    return this.databaseService.Category.update({
      where: {
        id: updateCategoryDto.id,
      },
      data: {
        ...new Category(updateCategoryDto),
      },
    });
  }

  async remove(id: string) {
    const cur = await this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Category not found');
    }
    return this.databaseService.Category.delete({
      where: {
        id: id,
      },
    });
  }
}
