import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { ReminderService } from '../reminder/reminder.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly mailService: MailService,
    private readonly reminderService: ReminderService,
  ) {}

  // @Cron('45 * * * * *')
  handleCron() {
    Logger.log('Called when the current second is 45');
  }

  // @Interval(10000)
  @Cron('0 0 8 * * *') //every day at 8am
  async handleInterval() {
    Logger.log('Called every 10 seconds');
    const listReminder = await this.reminderService.searchAndMapRemindersByUser();
    const listUser = listReminder.usersWithReminders;
    const listReminderToSendMail = listReminder.remindersByUser;
    Logger.log(listUser);
    for (const userWithReminder of listUser) {
      Logger.log(listReminderToSendMail[userWithReminder.user_id]);
      this.mailService.sendReminderEmail(listReminderToSendMail[userWithReminder.user_id]);
    }
  }
}
