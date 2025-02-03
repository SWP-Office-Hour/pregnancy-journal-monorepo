import { Test, TestingModule } from '@nestjs/testing';
import { StandardController } from './standard.controller';
import { StandardService } from './standard.service';

describe('StandardController', () => {
  let controller: StandardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandardController],
      providers: [StandardService],
    }).compile();

    controller = module.get<StandardController>(StandardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
