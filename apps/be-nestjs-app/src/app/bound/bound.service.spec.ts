import { Test, TestingModule } from '@nestjs/testing';
import { BoundService } from './bound.service';

describe('BoundService', () => {
  let service: BoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoundService],
    }).compile();

    service = module.get<BoundService>(BoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
