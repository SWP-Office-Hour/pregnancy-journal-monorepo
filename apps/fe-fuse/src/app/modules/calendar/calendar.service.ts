import { HttpClient } from '@angular/common/http';
import { Injectable, resource, ResourceRef, signal, WritableSignal } from '@angular/core';
import { ReminderCreateRequest, ReminderResponse, ReminderUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  private _reminder: ReminderResponse | null;

  get reminder(): ReminderResponse | null {
    return this._reminder;
  }

  set reminder(value: ReminderResponse) {
    this._reminder = value;
  }

  private _activeDay: WritableSignal<DateTime | null> = signal(null);

  get activeDay(): WritableSignal<DateTime<boolean> | null> {
    return this._activeDay;
  }

  set activeDay(value: DateTime | null) {
    this._activeDay.set(value);
  }

  protected _reminderResource: ResourceRef<ReminderResponse[]> = resource({
    loader: async () => {
      const response = await fetch(environment.apiUrl + 'reminders', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      });
      const reminders = await response.json();
      return reminders.map((reminder: ReminderResponse) => {
        return {
          ...reminder,
          remind_date: new Date(reminder.remind_date),
        };
      });
    },
  });

  get reminderResource() {
    return this._reminderResource;
  }

  deleteReminder(reminderId: string) {
    return this._httpClient.delete(environment.apiUrl + 'reminders/' + reminderId).pipe(
      map((res) => {
        this._reminderResource.set(this.reminderResource.value().filter((meeting) => meeting.reminder_id !== reminderId));
        return res;
      }),
    );
  }

  reloadMeetings() {
    this._reminderResource.reload();
    console.log('reloaded', this.reminderResource.value());
  }

  clearReminder() {
    this._reminder = null;
  }

  getMeetingByDate(date: DateTime) {
    return this.reminderResource.value()?.filter((meeting) => meeting.remind_date.toISOString().slice(0, 10) === date.toISODate());
  }

  createReminder(reminder: ReminderCreateRequest) {
    return this._httpClient
      .post<ReminderResponse>(environment.apiUrl + 'reminders', reminder, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response: ReminderResponse) => {
          this._reminderResource.set([...this.reminderResource.value(), { ...response, remind_date: new Date(response.remind_date) }]);
          return response;
        }),
      );
  }

  updateReminder(reminder: ReminderUpdateRequest) {
    console.log(reminder.color);
    return this._httpClient.patch<ReminderResponse>(environment.apiUrl + 'reminders/', reminder).pipe(
      map((response: ReminderResponse) => {
        const updatedMeetings = this.reminderResource.value().map((meeting) => {
          if (meeting.reminder_id === response.reminder_id) {
            return { ...response, remind_date: new Date(response.remind_date) };
          }
          return meeting;
        });
        this._reminderResource.set(updatedMeetings);
        return response;
      }),
    );
  }
}
