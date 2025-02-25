import { Injectable } from '@nestjs/common';
import { ReminderCreateRequest, ReminderResponse, ReminderType, ReminderUpdateRequest, Status } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReminderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UsersService,
  ) {}

  async create(createReminderDto: ReminderCreateRequest, userId: string): Promise<ReminderResponse> {
    await this.userService.getUserById(userId);

    return await this.databaseService.Reminder.create({
      data: {
        title: createReminderDto.title,
        content: createReminderDto.content,
        status: Status.ACTIVE,
        type: ReminderType.EVENT,
        remind_date: new Date(createReminderDto.remind_date),
        user: {
          connect: {
            user_id: userId,
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
        reminder_id: id,
      },
    });
    if (!result) {
      return null;
    }
    return result;
  }

  async update(updateReminderDto: ReminderUpdateRequest) {
    return await this.databaseService.Reminder.update({
      where: {
        reminder_id: updateReminderDto.reminder_id,
      },
      data: {
        title: updateReminderDto.title,
        content: updateReminderDto.content,
        remind_date: new Date(updateReminderDto.remind_date as string),
      },
    });
  }

  async remove(id: string) {
    return await this.databaseService.Reminder.delete({
      where: {
        reminder_id: id,
      },
    });
  }
}
