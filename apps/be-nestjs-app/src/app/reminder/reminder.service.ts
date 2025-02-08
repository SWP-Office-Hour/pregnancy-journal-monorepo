import { Injectable, NotFoundException } from '@nestjs/common';
import { ReminderCreateReq, ReminderUpdateReq } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReminderService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createReminderDto: ReminderCreateReq) {
    return this.databaseService.Reminder.create({
      data: {
        title: createReminderDto.title,
        content: createReminderDto.content,
        status: createReminderDto.status,
        type: createReminderDto.type,
        remind_date: new Date(createReminderDto.remindDate),
        user: {
          connect: {
            id: createReminderDto.user_id,
          },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.Reminder.findMany();
  }

  async findOne(id: string) {
    const result = await this.databaseService.Reminder.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException('Reminder not found');
    }
    return result;
  }

  async update(updateReminderDto: ReminderUpdateReq) {
    await this.findOne(updateReminderDto.id);

    return this.databaseService.Reminder.update({
      where: {
        id: updateReminderDto.id,
      },
      data: updateReminderDto,
    });
  }

  remove(id: string) {
    const check = this.findOne(id);
    if (!check) {
      throw new NotFoundException('Reminder not found');
    }
    return this.databaseService.Reminder.delete({
      where: {
        id: id,
      },
    });
  }
}
