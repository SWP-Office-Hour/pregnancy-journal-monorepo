import { Body, Controller, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { recordContract, RecordCreateRequest, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { RecordsService } from './records.service';

@Controller()
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(recordContract.createRecord)
  handleCreateRecord(@Body() record: RecordCreateRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(recordContract.createRecord, async () => {
      if (!req.decoded_authorization) {
        throw new UnauthorizedException('UnAuthorized');
      }

      const userId = req.decoded_authorization.user_id;
      const result = await this.recordService.createRecord({ record, userId });
      return {
        status: 200,
        body: result,
      };
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(recordContract.getRecordByUserId)
  handleGetRecordByUserId(@Req() request: RequestWithJWT) {
    return tsRestHandler(recordContract.updateRecord, async () => {
      if (!request.decoded_authorization) {
        throw new UnauthorizedException('Unauthorized');
      }
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

  @TsRestHandler(recordContract.deleteRecord)
  handleDeleteRecord(@Param('id') id: string) {
    return tsRestHandler(recordContract.createRecord, async () => {
      const mes = await this.recordService.deleteRecord(id);
      return {
        status: 201,
        body: mes,
      };
    });
  }
}
