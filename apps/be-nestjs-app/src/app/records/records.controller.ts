import { Body, Controller, ForbiddenException, Param, Req } from '@nestjs/common';
import { recordContract, RecordCreateRequest, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RecordsService } from './records.service';

@Controller()
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  @TsRestHandler(recordContract.createRecord)
  handleCreateRecord(@Body() record: RecordCreateRequest, @Req() req: Request) {
    return tsRestHandler(recordContract.createRecord, async () => {
      const childId = req.headers['child_id'] as string;
      if (!childId) {
        throw new ForbiddenException('Need child_id in headers');
      }

      const result = await this.recordService.createRecord({ record, childId: childId });
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(recordContract.getRecordByUserId)
  handleGetRecordByUserId(@Req() request: Request) {
    return tsRestHandler(recordContract.updateRecord, async () => {
      const childId = request.headers['child_id'] as string;
      if (!childId) {
        throw new ForbiddenException('Need child_id in headers');
      }
      const record = await this.recordService.getRecordByChildId(childId);
      return {
        status: 201,
        body: record,
      };
    });
  }

  @TsRestHandler(recordContract.getWarning)
  handleGetWarning(@Param('record_id') record_id: string) {
    return tsRestHandler(recordContract.getWarning, async () => {
      const record = await this.recordService.getWarning(record_id);
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

  @TsRestHandler(recordContract.getRecordById)
  handleGetRecordById(@Param('id') id: string) {
    return tsRestHandler(recordContract.getRecordById, async () => {
      const record = await this.recordService.getRecordById(id);
      return {
        status: 201,
        body: record[0],
      };
    });
  }
}
