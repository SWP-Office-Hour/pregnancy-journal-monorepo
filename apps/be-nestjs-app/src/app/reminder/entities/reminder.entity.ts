import { ReminderType } from '@pregnancy-journal-monorepo/contract';

interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  content: string;
  remind_date: Date;
  user_id: string;
  status: string;
}

export class ReminderEntity {
  id: string;
  title: string;
  type: ReminderType;
  content: string;
  remind_date: Date;
  user_id: string;
  status: string;

  constructor(reminderData: Reminder) {
    this.id = reminderData.id;
    this.title = reminderData.title;
    this.type = reminderData.type;
    this.content = reminderData.content;
    this.remind_date = reminderData.remind_date;
    this.user_id = reminderData.user_id;
    this.status = reminderData.status;
  }
}
