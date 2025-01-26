import { Test, TestingModule } from '@nestjs/testing';
import { BoundController } from './bound.controller';
import { BoundService } from './bound.service';

describe('BoundController', () => {
  let controller: BoundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoundController],
      providers: [BoundService],
    }).compile();

    controller = module.get<BoundController>(BoundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
