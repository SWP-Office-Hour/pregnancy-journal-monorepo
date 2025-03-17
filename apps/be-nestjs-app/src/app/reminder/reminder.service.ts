import { Injectable, NotFoundException } from '@nestjs/common';
import { ReminderCreateRequest, ReminderResponse, ReminderType, ReminderUpdateRequest, Status } from '@pregnancy-journal-monorepo/contract';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { ReminderToSendMailEntity, UserWithReminder } from './entities/reminder.entity';

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
    const remind_date = new Date(next_visit_doctor_date);
    remind_date.setDate(remind_date.getDate() - 1);
    const reminder_content = `Bạn có lịch hẹn tái khám vào ngày ${remind_date.getDate()}/${remind_date.getMonth() + 1}/${remind_date.getFullYear()}`;

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
        type: createReminderDto.type || ReminderType.USER_CREATED_REMINDER,
        remind_date: new Date(createReminderDto.remind_date),
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
  }

  findAll(userId: string) {
    const user = this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.Reminder.findMany({
      where: {
        user_id: userId,
      },
    });
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
    const remind_date = new Date(next_visit_doctor_date);

    remind_date.setDate(remind_date.getDate() - 1);
    const reminder_content = `Bạn có lịch hẹn tái khám vào ngày ${remind_date.getDate()}/${remind_date.getMonth() + 1}/${remind_date.getFullYear()}`;

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
        color: updateReminderDto.color ?? undefined,
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

  async searchAndMapRemindersByUser(): Promise<{
    remindersByUser: { [userId: string]: ReminderToSendMailEntity[] };
    usersWithReminders: UserWithReminder[];
  }> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set time to midnight to compare only date part
    tomorrow.setHours(0, 0, 0, 0);

    // Calculate the end of tomorrow
    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Fetch all reminders matching the criteria
    const reminders = await this.databaseService.Reminder.findMany({
      where: {
        remind_date: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        remind_date: 'asc',
      },
    });

    // Group reminders by user ID
    const remindersByUser: { [userId: string]: ReminderToSendMailEntity[] } = {};

    // Create a map to track unique users
    const uniqueUsers: Map<string, UserWithReminder> = new Map();

    reminders.forEach((reminder) => {
      if (!remindersByUser[reminder.user_id]) {
        remindersByUser[reminder.user_id] = [];

        // Add user to unique users map
        uniqueUsers.set(reminder.user_id, {
          user_id: reminder.user_id,
          name: reminder.user.name,
          email: reminder.user.email,
        });
      }
      remindersByUser[reminder.user_id].push(reminder as ReminderToSendMailEntity);
    });

    // Convert unique users map to array
    const usersWithReminders = Array.from(uniqueUsers.values());

    return {
      remindersByUser,
      usersWithReminders,
    };
  }

  // Search for reminders rồi group theo user để gửi email
  // async searchAndMapRemindersByUser(): Promise<{ [userId: string]: ReminderToSendMailEntity[] }> {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //
  //   // Set time to midnight to compare only date part
  //   tomorrow.setHours(0, 0, 0, 0);
  //
  //   // Calculate the end of tomorrow
  //   const endOfTomorrow = new Date(tomorrow);
  //   endOfTomorrow.setHours(23, 59, 59, 999);
  //
  //   // Fetch all reminders matching the criteria
  //   const reminders = await this.databaseService.Reminder.findMany({
  //     where: {
  //       remind_date: {
  //         gte: tomorrow,
  //         lte: endOfTomorrow,
  //       },
  //     },
  //     include: {
  //       user: {
  //         select: {
  //           name: true,
  //           email: true,
  //         },
  //       },
  //     },
  //     orderBy: {
  //       remind_date: 'asc',
  //     },
  //   });
  //
  //   // Group reminders by user ID
  //   const remindersByUser: { [userId: string]: ReminderToSendMailEntity[] } = {};
  //
  //   reminders.forEach((reminder) => {
  //     if (!remindersByUser[reminder.user_id]) {
  //       remindersByUser[reminder.user_id] = [];
  //     }
  //     remindersByUser[reminder.user_id].push(reminder);
  //   });
  //
  //   return remindersByUser;
  // }
}
