import { Body, Controller, Param, Req, UseGuards } from '@nestjs/common';
import { reminderContract, ReminderCreateRequest, ReminderType, ReminderUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { RequestWithJWT } from 'express';
import { AccessTokenAuthGuard } from '../auth/auth.guard';
import { ReminderService } from './reminder.service';

@Controller()
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @UseGuards(AccessTokenAuthGuard)
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

  @UseGuards(AccessTokenAuthGuard)
  @TsRestHandler(reminderContract.getAll)
  handleFindAll(@Req() req: RequestWithJWT) {
    return tsRestHandler(reminderContract.getAll, async () => {
      const auth = req.decoded_authorization;

      if (!auth) {
        return { status: 401, body: { message: 'Unauthorized' } };
      }

      const reminders = await this.reminderService.findAll(auth.user_id);
      return { status: 200, body: reminders };
    });
  }

  @TsRestHandler(reminderContract.getOne)
  handleFindOne(@Param('id') id: string) {
    return tsRestHandler(reminderContract.getOne, async () => {
      const reminder = await this.reminderService.findOne(id);
      if (!reminder) {
        return { status: 404, body: { message: 'Reminder not found' } };
      }
      return { status: 200, body: reminder };
    });
  }

  @TsRestHandler(reminderContract.update)
  handleUpdate(@Body() body: ReminderUpdateRequest) {
    return tsRestHandler(reminderContract.update, async () => {
      const isExist = await this.reminderService.findOne(body.reminder_id);
      if (!isExist) {
        return { status: 404, body: { message: 'Reminder not found' } };
      }
      if (isExist.type == ReminderType.FOLLOW_UP_MEETING) {
        return { status: 400, body: { message: 'Cannot update meeting' } };
      }
      const reminder = await this.reminderService.update(body);
      return { status: 200, body: reminder };
    });
  }

  @TsRestHandler(reminderContract.delete)
  handleDelete(@Param() { id }: { id: string }) {
    return tsRestHandler(reminderContract.delete, async () => {
      const isExist = await this.reminderService.findOne(id);
      if (!isExist) {
        return { status: 404, body: { message: 'Reminder not found' } };
      }
      if (isExist.type == ReminderType.FOLLOW_UP_MEETING) {
        return { status: 400, body: { message: 'Cannot delete meeting' } };
      }
      const deleted = await this.reminderService.remove(id);
      return { status: 200, body: deleted };
    });
  }
}
