import { Injectable, resource, ResourceRef, signal, WritableSignal } from '@angular/core';
import { ReminderResponse } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor() {}

  private _activeDay: WritableSignal<DateTime | null> = signal(null);

  get activeDay(): WritableSignal<DateTime<boolean> | null> {
    return this._activeDay;
  }

  set activeDay(value: DateTime | null) {
    this._activeDay.set(value);
  }

  private _meetings: ResourceRef<ReminderResponse[]> = resource({
    loader: async () => {
      const response = await fetch(environment.apiUrl + 'reminders');
      const reminders = await response.json();
      return reminders.map((reminder: ReminderResponse) => {
        return {
          ...reminder,
          remind_date: new Date(reminder.remind_date),
        };
      });
    },
  });

  get meetings() {
    return this._meetings.value;
  }

  getMeetingByDate(date: DateTime) {
    return this.meetings()?.filter((meeting) => meeting.remind_date.toISOString().slice(0, 10) === date.toISODate());
  }

  createReminder(reminder: any) {
    console.log(reminder);
  }
}
