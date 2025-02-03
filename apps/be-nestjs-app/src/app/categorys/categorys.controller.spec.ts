import { Test, TestingModule } from '@nestjs/testing';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';

describe('CategorysController', () => {
  let controller: CategorysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorysController],
      providers: [CategorysService],
    }).compile();

    controller = module.get<CategorysController>(CategorysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
