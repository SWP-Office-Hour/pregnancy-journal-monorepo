import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ReminderResponse } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { CalendarService } from '../../calendar/calendar.service';
import { ReminderEditorComponent } from '../../calendar/reminder-editor/reminder-editor.component';

@Component({
  selector: 'app-home-reminder',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, ToastModule, ConfirmPopupModule, DatePipe],
  providers: [ConfirmationService, MessageService],
  templateUrl: './home-reminder.component.html',
})
export class HomeReminderComponent implements OnInit {
  isLoading = true;
  hasMoreReminders = false;
  todayReminders: ReminderResponse[] = [];
  tomorrowReminders: ReminderResponse[] = [];
  upcomingReminders: ReminderResponse[] = [];
  allReminders: ReminderResponse[] = [];

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: HttpClient,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.http
      .get<ReminderResponse[]>(environment.apiUrl + 'reminders', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .subscribe((reminders) => {
        this.allReminders = reminders.map((reminder) => {
          return {
            ...reminder,
            remind_date: new Date(reminder.remind_date),
          };
        });
        this.loadReminders();
      });
  }

  loadReminders(): void {
    this.isLoading = true;

    // Get all reminders from the service

    if (this.allReminders && this.allReminders.length > 0) {
      // Get current date values
      const today = DateTime.now().startOf('day');
      const tomorrow = today.plus({ days: 1 }).startOf('day');
      const dayAfterTomorrow = today.plus({ days: 2 }).startOf('day');

      // Filter reminders for today
      this.todayReminders = this.allReminders
        .filter((reminder) => {
          const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
          return reminderDate >= today && reminderDate < tomorrow;
        })
        .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime());

      // Filter reminders for tomorrow
      this.tomorrowReminders = this.allReminders
        .filter((reminder) => {
          const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
          return reminderDate >= tomorrow && reminderDate < dayAfterTomorrow;
        })
        .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime());

      // Filter reminders for upcoming days
      this.upcomingReminders = this.allReminders
        .filter((reminder) => {
          const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
          return reminderDate >= dayAfterTomorrow;
        })
        .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime())
        .slice(0, 3); // Display only next 3 upcoming reminders

      // Check if we have more reminders than we're showing
      const totalShown = this.todayReminders.length + this.tomorrowReminders.length + this.upcomingReminders.length;
      this.hasMoreReminders = this.allReminders.length > totalShown;
    }

    this.isLoading = false;
  }

  openReminderEditor(): void {
    const dialogRef = this.dialog.open(ReminderEditorComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadReminders();
    });
  }

  editReminder(reminder: ReminderResponse): void {
    this.calendarService.reminder = reminder;
    const dialogRef = this.dialog.open(ReminderEditorComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadReminders();
    });
  }

  deleteReminder(reminder: ReminderResponse, event?: Event): void {
    if (event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bạn có chắc chắn muốn xóa nhắc nhở này?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xóa',
        rejectLabel: 'Hủy',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.calendarService.deleteReminder(reminder.reminder_id).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nhắc nhở', life: 3000 });
            this.loadReminders();
          });
        },
      });
    } else {
      this.calendarService.deleteReminder(reminder.reminder_id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nhắc nhở', life: 3000 });
        this.loadReminders();
      });
    }
  }
}
