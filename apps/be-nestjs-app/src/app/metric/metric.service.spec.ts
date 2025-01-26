import { Test, TestingModule } from '@nestjs/testing';
import { MetricService } from './metric.service';

describe('MetricService', () => {
  let service: MetricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricService],
    }).compile();

    service = module.get<MetricService>(MetricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
