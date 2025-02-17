import { Controller, Param } from '@nestjs/common';
import { standardContract, StandardCreateReq } from '@pregnancy-journal-monorepo/contract';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { StandardService } from './standard.service';

@Controller()
export class StandardController {
  constructor(private readonly standardService: StandardService) {}

  @TsRestHandler(standardContract.create)
  handleCreate(createStandardDto: StandardCreateReq) {
    return tsRestHandler(standardContract.create, async () => {
      const standard = await this.standardService.create(createStandardDto);
      return {
        status: 201,
        body: standard,
      };
    });
  }

  @TsRestHandler(standardContract.getAllStandardByMetricId)
  handleGetByMetricId(@Param('metric_id') metricId: string) {
    return tsRestHandler(standardContract.create, async () => {
      const standard = await this.standardService.findStandardByMetricId(metricId);
      return {
        status: 200,
        body: standard,
      };
    });
  }

  // @TsRestHandler(standardContract.create)
  // handleCreate(createStandardDto: StandardCreateReq) {
  //   return tsRestHandler(standardContract.create, async () => {
  //     const standard = await this.standardService.create(createStandardDto);
  //     return {
  //       status: 201,
  //       body: standard,
  //     };
  //   });
  // }
  //
  // @TsRestHandler(standardContract.create)
  // handleCreate(createStandardDto: StandardCreateReq) {
  //   return tsRestHandler(standardContract.create, async () => {
  //     const standard = await this.standardService.create(createStandardDto);
  //     return {
  //       status: 201,
  //       body: standard,
  //     };
  //   });
  // }
}
