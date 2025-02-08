import { Controller, NotFoundException, Param } from '@nestjs/common';
import { hospitalContract } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { HospitalService } from './hospital.service';

@Controller()
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @TsRestHandler(hospitalContract.getAll)
  handleFindAllHospitals() {
    return tsRestHandler(hospitalContract.getAll, async () => {
      const hospitalises = await this.hospitalService.findAll();
      return { status: 200, body: hospitalises };
    });
  }

  @TsRestHandler(hospitalContract.getOne)
  handleFindOneHospitals(@Param('id') id: string) {
    return tsRestHandler(hospitalContract.getOne, async () => {
      const hospital = await this.hospitalService.findOne(id);
      if (!hospital) {
        throw new NotFoundException('Hospital not found');
      }
      return { status: 200, body: hospital };
    });
  }
}
