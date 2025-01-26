import { Test, TestingModule } from '@nestjs/testing';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

describe('MetricController', () => {
  let controller: MetricController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricController],
      providers: [MetricService],
    }).compile();

    controller = module.get<MetricController>(MetricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
