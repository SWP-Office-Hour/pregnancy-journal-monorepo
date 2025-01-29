import { Body, Controller, NotFoundException, Param } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { reminderContract, ReminderCreateReq, ReminderUpdateReq } from '@pregnancy-journal-monorepo/contract';

@Controller()
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @TsRestHandler(reminderContract.create)
  handleCreate(@Body() body: ReminderCreateReq) {
    return tsRestHandler(reminderContract.create, async () => {
      const reminder = await this.reminderService.create(body);
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
  handleUpdate(@Body() body: ReminderUpdateReq) {
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
