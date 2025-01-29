import { Test, TestingModule } from '@nestjs/testing';
import { StandardService } from './standard.service';

describe('StandardService', () => {
  let service: StandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandardService],
    }).compile();

    service = module.get<StandardService>(StandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
