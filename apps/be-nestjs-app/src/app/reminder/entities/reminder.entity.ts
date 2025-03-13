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

export interface ReminderToSendMailEntity {
  reminder_id: string;
  type: number;
  title: string;
  content: string;
  remind_date: Date;
  status: number;
  user_id: string;
  visit_record_id?: string | null;
  color?: string | null;
  user: {
    name: string;
    email: string;
  };
}

export interface UserWithReminder {
  user_id: string;
  name: string;
  email: string;
}

export interface ReminderEmailResponse {
  remindersByUser: { [userId: string]: ReminderToSendMailEntity[] };
  usersWithReminders: UserWithReminder[];
}
