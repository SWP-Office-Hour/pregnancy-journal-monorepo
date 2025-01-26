import { Test, TestingModule } from '@nestjs/testing';
import { HosiptalService } from './hosiptal.service';

describe('HosiptalService', () => {
  let service: HosiptalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HosiptalService],
    }).compile();

    service = module.get<HosiptalService>(HosiptalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
