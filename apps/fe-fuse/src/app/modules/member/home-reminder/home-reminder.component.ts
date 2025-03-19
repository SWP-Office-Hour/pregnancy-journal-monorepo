import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, resource, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ReminderResponse, ReminderType } from '@pregnancy-journal-monorepo/contract';
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
  todayReminders = signal<ReminderResponse[]>([]);
  tomorrowReminders = signal<ReminderResponse[]>([]);
  upcomingReminders = signal<ReminderResponse[]>([]);
  allReminders: ReminderResponse[] = [];

  // Resource
  reminderResource = resource<ReminderResponse[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}reminders`, {
          signal: abortSignal,
          headers: {
            Authorization: `Bearer ${this._authService.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch reminders: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        this.notifyError(error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  });

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _authService: AuthService,
    private _httpClient: HttpClient,
  ) {
    effect(() => {
      this.allReminders = this.reminderResource.value();
      this.loadReminders();
    });
  }

  ngOnInit(): void {
    // Initial data load happens automatically through the resource and effect
  }

  loadReminders(): void {
    if (this.allReminders && this.allReminders.length > 0) {
      console.log('All reminders:', this.allReminders);
      // Get current date values
      const today = DateTime.now().startOf('day');
      const tomorrow = today.plus({ days: 1 }).startOf('day');
      const dayAfterTomorrow = today.plus({ days: 2 }).startOf('day');
      // Filter reminders for today
      this.todayReminders.set(
        this.allReminders
          .filter((reminder) => {
            const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
            return reminderDate >= today && reminderDate < tomorrow;
          })
          .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime()),
      );
      // Filter reminders for tomorrow
      this.tomorrowReminders.set(
        this.allReminders
          .filter((reminder) => {
            const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
            return reminderDate >= tomorrow && reminderDate < dayAfterTomorrow;
          })
          .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime()),
      );
      // Filter reminders for upcoming days
      this.upcomingReminders.set(
        this.allReminders
          .filter((reminder) => {
            const reminderDate = DateTime.fromJSDate(new Date(reminder.remind_date));
            return reminderDate >= dayAfterTomorrow;
          })
          .sort((a, b) => new Date(a.remind_date).getTime() - new Date(b.remind_date).getTime())
          .slice(0, 3),
      ); // Display only next 3 upcoming reminders
      // Check if we have more reminders than we're showing
      const totalShown = this.todayReminders.length + this.tomorrowReminders.length + this.upcomingReminders.length;
      this.hasMoreReminders = this.allReminders.length > totalShown;
    }
  }

  openReminderEditor(): void {
    const dialogRef = this.dialog.open(ReminderEditorComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reminderResource.reload();
      }
    });
  }

  editReminder(reminder: ReminderResponse): void {
    this.calendarService.reminder = reminder;
    const dialogRef = this.dialog.open(ReminderEditorComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reminderResource.reload();
      }
    });
  }

  async deleteReminder(reminder: ReminderResponse, event?: Event): Promise<void> {
    if (event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bạn có chắc chắn muốn xóa nhắc nhở này?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xóa',
        rejectLabel: 'Hủy',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: async () => {
          try {
            const response = await fetch(`${environment.apiUrl}reminders/${reminder.reminder_id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${this._authService.accessToken}`,
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to delete reminder: ${response.status}`);
            }

            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nhắc nhở', life: 3000 });
            this.reminderResource.reload();
          } catch (error) {
            this.notifyError(error);
          }
        },
      });
    } else {
      try {
        const response = await fetch(`${environment.apiUrl}reminders/${reminder.reminder_id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this._authService.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete reminder: ${response.status}`);
        }

        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nhắc nhở', life: 3000 });
        this.reminderResource.reload();
      } catch (error) {
        this.notifyError(error);
      }
    }
  }

  private notifyError(error: any): void {
    console.error('Error in HomeReminderComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Đã xảy ra lỗi không mong muốn',
      life: 4000,
    });
  }

  protected readonly ReminderType = ReminderType;
}
