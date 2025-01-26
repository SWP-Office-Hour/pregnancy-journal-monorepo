import { Test, TestingModule } from '@nestjs/testing';
import { HosiptalController } from './hosiptal.controller';
import { HosiptalService } from './hosiptal.service';

describe('HosiptalController', () => {
  let controller: HosiptalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HosiptalController],
      providers: [HosiptalService],
    }).compile();

    controller = module.get<HosiptalController>(HosiptalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
