import { Test, TestingModule } from '@nestjs/testing';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospitalController';

describe('HospitalController', () => {
  let controller: HospitalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalController],
      providers: [HospitalService],
    }).compile();

    controller = module.get<HospitalController>(HospitalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
