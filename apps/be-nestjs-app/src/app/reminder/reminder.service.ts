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

  async createByNextVisitDoctorDate({
    visit_record_id,
    user_id,
    next_visit_doctor_date,
  }: {
    visit_record_id: string;
    user_id: string;
    next_visit_doctor_date: string;
  }): Promise<ReminderResponse> {
    const nextVisitDoctorDate = new Date(next_visit_doctor_date);
    const remind_date = new Date(nextVisitDoctorDate);
    remind_date.setDate(remind_date.getDate() - 1);
    const reminder_content = `Bạn có lịch hẹn tái khám vào ngày ${nextVisitDoctorDate.getDate()}/${nextVisitDoctorDate.getMonth() + 1}/${remind_date.getFullYear()}`;

    return await this.databaseService.Reminder.create({
      data: {
        title: 'Ngày tái khám',
        content: reminder_content,
        status: Status.ACTIVE,
        type: ReminderType.FOLLOW_UP_MEETING,
        remind_date,
        user: {
          connect: {
            user_id,
          },
        },
        visit_record: {
          connect: {
            visit_record_id,
          },
        },
      },
    });
  }

  async create(createReminderDto: ReminderCreateRequest, userId: string): Promise<ReminderResponse> {
    await this.userService.getUserById(userId);

    return await this.databaseService.Reminder.create({
      data: {
        color: createReminderDto.color,
        title: createReminderDto.title,
        content: createReminderDto.content,
        status: Status.ACTIVE,
        type: ReminderType.USER_CREATED_EVENT,
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

  async updateByNextVisitDoctorDate({
    next_visit_doctor_date,
    visit_record_id,
    user_id,
  }: {
    next_visit_doctor_date: string;
    visit_record_id: string;
    user_id: string;
  }) {
    const nextVisitDoctorDate = new Date(next_visit_doctor_date);
    const remind_date = new Date(nextVisitDoctorDate);
    remind_date.setDate(remind_date.getDate() - 1);
    const reminder_content = `Bạn có lịch hẹn tái khám vào ngày ${nextVisitDoctorDate.getDate()}/${nextVisitDoctorDate.getMonth() + 1}/${remind_date.getFullYear()}`;

    const reminder = await this.databaseService.Reminder.findFirst({
      where: {
        visit_record_id,
      },
    });

    if (!reminder) {
      return await this.createByNextVisitDoctorDate({ visit_record_id, user_id, next_visit_doctor_date });
    }
    return await this.databaseService.Reminder.update({
      where: {
        reminder_id: reminder.reminder_id,
      },
      data: {
        title: 'Ngày tái khám',
        content: reminder_content,
        remind_date,
      },
    });
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
