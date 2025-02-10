import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { recordContract, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { RecordsService } from './records.service';

@Controller()
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  // @UseGuards(AccessTokenAuthGuard)
  // @TsRestHandler(recordContract.createRecord)
  // handleCreateRecord(@Body() record: RecordCreateRequest, @Req() req: RequestWithJWT) {
  //   return tsRestHandler(recordContract.createRecord, () => {
  //     const userId = req.decoded_authorization.user_id;
  //     return this.recordService.createRecord({ record, userId });
  //   });
  // }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(recordContract.getRecordByUserId)
  handleGetRecordByUserId(@Req() request: RequestWithJWT) {
    return tsRestHandler(recordContract.createRecord, async () => {
      const id = request.decoded_authorization.user_id;
      const record = await this.recordService.getRecordByUserId(id);
      return {
        status: 201,
        body: record,
      };
    });
  }

  @TsRestHandler(recordContract.updateRecord)
  handleUpdateRecord(@Body() record: RecordUpdateRequest) {
    return tsRestHandler(recordContract.createRecord, async () => {
      const result = await this.recordService.updateRecord(record);
      return {
        status: 201,
        body: result,
      };
    });
  }

  // @TsRestHandler(recordContract.deleteRecord)
  // handleDeleteRecord(@Param('id') id: string) {
  //   return tsRestHandler(recordContract.createRecord, () => {
  //     return this.recordService.deleteRecord(id);
  //   });
  // }
}
