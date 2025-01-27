import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ReminderCreateReq, ReminderUpdateReq } from '@pregnancy-journal-monorepo/contract';

@Injectable()
export class ReminderService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {
  }

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
            id: createReminderDto.user_id
          }
        }
      }
    });
  }

  findAll() {
    return this.databaseService.Reminder.findMany();
  }

  findOne(id: string) {
    const result = this.databaseService.Reminder.findUnique({
      where: {
        id: id
      }
    });
    if (!result) {
      throw new NotFoundException('Reminder not found');
    }
    return result;
  }

  update(updateReminderDto: ReminderUpdateReq) {
    const cur = this.findOne(updateReminderDto.id);
    if (!cur) {
      throw new NotFoundException('Reminder not found');
    }

    const updateData = {
      title: updateReminderDto.title,
      content: updateReminderDto.content,
      status: updateReminderDto.status,
      type: updateReminderDto.type,
      remind_date: updateReminderDto.remindDate,
      user: {
        connect: {
          id: updateReminderDto.user_id
        }
      }
    };

    // Xóa các trường có giá trị null hoặc rỗng
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === null || updateData[key] === '') {
        delete updateData[key];
      }
    });

    return this.databaseService.Reminder.update({
      where: {
        id: updateReminderDto.id
      },
      data: updateData
    });

  }

  remove(id: string) {
    const check = this.findOne(id);
    if (!check) {
      throw new NotFoundException('Reminder not found');
    }
    return this.databaseService.Reminder.delete({
      where: {
        id: id
      }
    });
  }
}
