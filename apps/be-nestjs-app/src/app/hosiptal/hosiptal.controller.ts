import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { HosiptalService } from './hosiptal.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { hospitalContract } from '@pregnancy-journal-monorepo/contract';

@Controller()
export class HosiptalController {
  constructor(private readonly hosiptalService: HosiptalService) {}

  @TsRestHandler(hospitalContract.getAll)
  handleFindAllHosiptals() {
    return tsRestHandler(hospitalContract.getAll, async () => {
      const hosiptals = await this.hosiptalService.findAll();
      return { status: 200, body: hosiptals };
    });
  }

  @TsRestHandler(hospitalContract.getOne)
  handleFindOneHosiptals(@Param('id') id: string) {
    return tsRestHandler(hospitalContract.getOne, async () => {
      const hosiptal = await this.hosiptalService.findOne(id);
      if (!hosiptal) {
        throw new NotFoundException('Hospital not found');
      }
      return { status: 200, body: hosiptal };
    });
  }
}
