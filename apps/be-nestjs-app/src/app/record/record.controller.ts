import { Controller, Param } from '@nestjs/common';
import { recordContract } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  // @UseGuards(AccessTokenAuthGuard)
  // @TsRestHandler(recordContract.createRecord)
  // handleCreateRecord(@Body() record: RecordCreateRequest, @Req() req: RequestWithJWT) {
  //   return tsRestHandler(recordContract.createRecord, () => {
  //     const userId = req.decoded_authorization.user_id;
  //     return this.recordService.createRecord({ record, userId });
  //   });
  // }

  @TsRestHandler(recordContract.getRecordById)
  handleGetRecordByUserId(@Param('id') id: string) {
    return tsRestHandler(recordContract.createRecord, async () => {
      const record = await this.recordService.getRecordByUserId(id);
      const resolvedRecord = await Promise.all(
        record.map(async (rec) => {
          const resolvedData = await Promise.all(rec.data);
          return { ...rec, data: resolvedData };
        }),
      );
      return {
        status: 200,
        body: resolvedRecord,
      };
    });
  }

  // @TsRestHandler(recordContract.updateRecord)
  // handleUpdateRecord(@Body() record: RecordUpdateRequest) {
  //   return tsRestHandler(recordContract.createRecord, () => {
  //     return this.recordService.updateRecord(record);
  //   });
  // }
  //
  // @TsRestHandler(recordContract.deleteRecord)
  // handleDeleteRecord(@Param('id') id: string) {
  //   return tsRestHandler(recordContract.createRecord, () => {
  //     return this.recordService.deleteRecord(id);
  //   });
  // }
}
