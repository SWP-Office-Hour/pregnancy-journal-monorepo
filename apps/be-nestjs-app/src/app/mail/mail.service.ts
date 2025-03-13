import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserResponseType } from '@pregnancy-journal-monorepo/contract';
import { v4 as uuidv4 } from 'uuid';
import { ReminderToSendMailEntity } from '../reminder/entities/reminder.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async resetPassword(user: UserResponseType) {
    const uuid = uuidv4().replace(/[^0-9]/g, '');
    const code = parseInt(uuid.slice(0, 6), 10);

    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@gmail.com', // sender address
      subject: 'Reset Password', // Subject line
      text: 'reset password', // plaintext body
      template: 'reset-password',
      context: {
        name: user.name,
        resetCode: code,
      },
    });

    return code;
  }

  async sendReminderEmail(reminders: ReminderToSendMailEntity[]) {
    if (!reminders.length) return false;

    const user = reminders[0].user;

    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@gmail.com',
      subject: 'Nhắc nhở lịch hẹn',
      text: `Bạn có ${reminders.length} nhắc nhở cho ngày mai`,
      template: 'reminder',
      context: {
        name: user.name,
        reminders: reminders.map((reminder) => ({
          ...reminder,
          type: this.getReminderTypeClass(reminder.type),
          remind_date: this.formatDate(reminder.remind_date),
        })),
      },
    });

    return true;
  }

  private formatDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  private getReminderTypeClass(type: number): string {
    switch (type) {
      case 1:
        return 'follow-up-meeting';
      case 2:
        return 'user-created-event';
      default:
        return '';
    }
  }
}
