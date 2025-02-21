import { Body, Controller, Param, Req } from '@nestjs/common';
import { reminderContract, ReminderCreateRequest, ReminderUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { ReminderService } from './reminder.service';

@Controller()
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @TsRestHandler(reminderContract.create)
  handleCreate(@Body() body: ReminderCreateRequest, @Req() req: RequestWithJWT) {
    return tsRestHandler(reminderContract.create, async () => {
      const auth = req.decoded_authorization;

      if (!auth) {
        return { status: 401, body: { message: 'Unauthorized' } };
      }

      const reminder = await this.reminderService.create(body, auth.user_id);
      return { status: 200, body: reminder };
    });
  }

  @TsRestHandler(reminderContract.getAll)
  handleFindAll() {
    return tsRestHandler(reminderContract.getAll, async () => {
      const reminders = await this.reminderService.findAll();
      return { status: 200, body: reminders };
    });
  }

  @TsRestHandler(reminderContract.getOne)
  handleFindOne(@Param('id') id: string) {
    return tsRestHandler(reminderContract.getOne, async () => {
      const reminder = await this.reminderService.findOne(id);
      return { status: 200, body: reminder };
    });
  }

  @TsRestHandler(reminderContract.update)
  handleUpdate(@Body() body: ReminderUpdateRequest) {
    return tsRestHandler(reminderContract.update, async () => {
      const reminder = await this.reminderService.update(body);
      return { status: 200, body: reminder };
    });
  }

  @TsRestHandler(reminderContract.delete)
  handleDelete(@Body() body: { id: string }) {
    return tsRestHandler(reminderContract.delete, async () => {
      const deleted = await this.reminderService.remove(body.id);
      return { status: 200, body: deleted };
    });
  }
}
