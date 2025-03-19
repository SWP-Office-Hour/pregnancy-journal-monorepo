import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { Component, effect, ResourceStatus, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReminderColor, ReminderCreateRequest, ReminderResponse, ReminderType, ReminderUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { Button, ButtonModule } from 'primeng/button';
import { CalendarService } from './calendar.service';

interface Theme {
  title: string;
  color: string;
}

// Register Vietnamese locale data
registerLocaleData(localeVi);

@Component({
  selector: 'app-calendar',
  imports: [
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    DragDropModule,
    FormsModule,
    Button,
    ButtonModule,
    DragDropModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  providers: [],
})
export class CalendarComponent {
  protected readonly ReminderType = ReminderType;
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  calendarDays: Date[];
  weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  reminderArraySignal = signal<ReminderResponse[]>([]);
  status: Signal<ResourceStatus> = signal(ResourceStatus.Idle);
  showReminderModal: boolean = false;
  newReminder: ReminderResponse = {
    title: '',
    content: '',
    remind_date: new Date(),
    color: ReminderColor.USER_CREATED_REMINDER_COLOR,
    type: ReminderType.USER_CREATED_REMINDER,
  };
  themes: Theme[] = [
    { title: 'Khám thai', color: 'FA8FCA' }, // Soft pink
    { title: 'Uống thuốc', color: 'A593EC' }, // Soft lavender
    { title: 'Tiêm phòng', color: '5BA8FF' }, // Soft blue
    { title: 'Siêu âm', color: '2ECC83' }, // Soft mint
    { title: 'Xét nghiệm', color: 'F86666' }, //
  ];
  isEditMode = 0;
  isHovering: boolean = false;
  // Add a property to track the reminder being edited
  editingReminder: ReminderResponse = { title: '', content: '', remind_date: new Date(), color: '', type: ReminderType.USER_CREATED_REMINDER };

  constructor(private _calendarService: CalendarService) {
    this.reminderArraySignal = this._calendarService.reminderResource.value;
    this.status = this._calendarService.reminderResource.status;
    effect(() => {
      if (this.status() == ResourceStatus.Resolved || this.status() == ResourceStatus.Local) {
        this.generateCalendarDays();
      }
    });
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create a properly typed array for calendar days
    const dateArray: Array<{ date: Date }> = [];

    // Calculate days needed from previous month
    const startPadding = firstDay.getDay();

    // Add previous month's days
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1);
      dateArray.push({ date: prevDate });
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      dateArray.push({ date: currentDate });
    }

    // Calculate how many days we need from next month to complete the grid
    // A standard calendar display needs 6 rows of 7 days = 42 total cells
    const totalCells = 42;
    const endPadding = totalCells - dateArray.length;

    // Add next month's days
    for (let i = 1; i <= endPadding; i++) {
      const nextDate = new Date(year, month + 1, i);
      dateArray.push({ date: nextDate });
    }
    this.calendarDays = dateArray.map((d) => d.date);
  }

  // Helper function to find reminder for a specific date
  getRemindersForDate(date: Date): ReminderResponse[] {
    //check reminder có tồn tại không
    if (!this.reminderArraySignal()) {
      return [];
    }
    // Find existing reminder
    // console.log('date', date);
    // console.log('getRemindersForDate có chạy nè');
    return !date ? [] : this.reminderArraySignal()?.filter((r) => this.getDateKey(r.remind_date) == this.getDateKey(date));
  }

  // Create a unique string key for a date (without time)
  getDateKey(date: Date): string {
    return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : '';
  }

  navigateMonth(offset: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset);
    this.generateCalendarDays();
  }

  navigateThisMonth() {
    this.currentDate = new Date();
    this.generateCalendarDays();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  isSelected(date: Date): boolean {
    return this.selectedDate
      ? date.getDate() === this.selectedDate.getDate() &&
          date.getMonth() === this.selectedDate.getMonth() &&
          date.getFullYear() === this.selectedDate.getFullYear()
      : false;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  isMonth(date: Date): boolean {
    return this.currentDate ? date.getMonth() === this.currentDate.getMonth() && date.getFullYear() === this.currentDate.getFullYear() : false;
  }

  isDueDate(date: Date): boolean {
    //check xem ngày input có phải là ngày due date của event nào đó không và ngày đó phải có status là ngày đẻ
    return this.reminderArraySignal()?.some((event) => this.isSameDay(event.remind_date, date) && event.type == ReminderType.USER_DUE_DATE);
  }

  createReminder() {
    // Using the template-driven form validation
    if (this.newReminder.title && this.newReminder.title.length >= 3) {
      if (this.isEditMode && this.editingReminder) {
        // Update existing event using the stored reference instead of trying to match by title
        this.reminderArraySignal.update((events) => {
          return events.map((e) => {
            // Find the event by reference, not by properties
            if (e === this.editingReminder) {
              return { ...this.newReminder }; // Replace with updated data
            }
            return e;
          });
        });
      } else {
        // Create a new event (existing code)
        const eventCopy: ReminderCreateRequest = {
          title: this.newReminder.title,
          content: this.newReminder.content || '',
          remind_date: new Date(this.selectedDate).toLocaleDateString('en-CA'),
          color: this.newReminder.color || ReminderColor.USER_CREATED_REMINDER_COLOR,
          type: this.newReminder.type || ReminderType.USER_CREATED_REMINDER,
        };

        // Add the event to our events array
        this._calendarService.createReminder(eventCopy).subscribe(() => {});
      }

      // Close the modal
      this.closeCreateEventModal();
    }
  }

  //lấy list màu từ enum
  getReminderColors(): ReminderColor[] {
    return Object.values(ReminderColor);
  }

  openCreateEventModal() {
    // Prepare the new event with the selected date
    this.newReminder.remind_date = new Date(this.selectedDate);
    this.isEditMode = 0; // Reset to create mode

    // Set a timeout before showing the modal for a smoother effect
    setTimeout(() => {
      this.showReminderModal = true;
    }, 10);
  }

  closeCreateEventModal() {
    // Hide the modal first
    this.showReminderModal = false;

    // Reset the form after the animation completes
    setTimeout(() => {
      this.newReminder = {
        title: '',
        remind_date: new Date(),
        color: ReminderColor.USER_CREATED_REMINDER_COLOR,
      };
      this.isEditMode = 0;
      this.editingReminder = { title: '', content: '', remind_date: new Date(), color: '', type: ReminderType.USER_CREATED_REMINDER }; // Clear the reference to the edited event
    }, 300);
  }

  chooseColor(event: ReminderResponse): string {
    if (!event.color) {
      if (event.type == ReminderType.USER_CREATED_REMINDER) {
        return '#' + ReminderColor.USER_CREATED_REMINDER_COLOR;
      }
      if (event.type == ReminderType.FOLLOW_UP_MEETING) {
        return '#' + ReminderColor.FOLLOW_UP_MEETING_COLOR;
      }
    }
    return '#' + event.color;
  }

  chooseColorTheme(color: string): string {
    return '#' + color;
  }

  dropEvent(event: CdkDragDrop<ReminderResponse[]>, targetDate: Date) {
    if (event.previousContainer === event.container) {
      // Reordering in the same date
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Check if we're dragging from themes to events
      const sourceData = event.previousContainer.data;
      const draggedItem = sourceData[event.previousIndex];

      // If the dragged item is a theme (check if it has no 'date' property)
      if (!('date' in draggedItem)) {
        // This is a theme being dropped onto a date
        const draggedTheme = draggedItem as unknown as Theme;

        // Create a new event from the theme
        const newEvent: ReminderCreateRequest = {
          title: draggedTheme.title,
          content: '',
          remind_date: targetDate.toLocaleDateString('en-CA'),
          color: draggedTheme.color,
          type: ReminderType.USER_CREATED_REMINDER,
        };
        this._calendarService.createReminder(newEvent).subscribe(() => {});
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        // Update the date of the transferred event
        event.container.data[event.currentIndex].remind_date = new Date(targetDate);
      }
    }
  }

  dropTheme(event: CdkDragDrop<Theme[]>) {
    // If dropping on a date
    if (event.container.id.startsWith('date-')) {
      // Extract the index from the container ID (e.g. "date-5" -> 5)
      const dateIndex = parseInt(event.container.id.split('-')[1]);
      if (isNaN(dateIndex) || dateIndex < 0 || dateIndex >= this.calendarDays.length) {
        return;
      }

      // Get the target date
      const targetDate = this.calendarDays[dateIndex];

      // Get the theme
      const theme = this.themes[event.previousIndex];

      // Create a new event from the theme
      const newEvent: ReminderResponse = {
        title: theme.title,
        remind_date: new Date(targetDate),
        color: theme.color,
      };

      // Add to events array
      this.reminderArraySignal.update((event) => {
        event.push(newEvent);
        return event;
      });

      // Note: We always preserve themes when dropping them into calendar dates
      // No deletion code here - themes are reusable templates
    } else {
      // Regular drag and drop within themes list
      if (event.previousContainer === event.container) {
        moveItemInArray(this.themes, event.previousIndex, event.currentIndex);
      }
    }
  }

  // Add these methods for edit and delete functionality
  editEvent(event: ReminderResponse, status: number) {
    // Prepare the form with the selected event
    this.newReminder = { ...event };
    this.isEditMode = status;
    this.editingReminder = event; // Store a reference to the edited event

    // Set a timeout before showing the modal for a smoother effect
    setTimeout(() => {
      this.showReminderModal = true;
    }, 10);
  }

  updateEvent() {
    //store the updated event
    if (this.newReminder.title) {
      this.editingReminder.title = this.newReminder.title;
    }
    if (this.newReminder.content) {
      this.editingReminder.content = this.newReminder.content;
    }
    if (this.newReminder.color) {
      this.editingReminder.color = this.newReminder.color;
    }

    //convert to ReminderUpdateRequest
    const reminderUpdateRequest: ReminderUpdateRequest = {
      reminder_id: this.editingReminder.reminder_id,
      title: this.editingReminder.title,
      content: this.editingReminder.content,
      remind_date: new Date(this.editingReminder.remind_date).toLocaleDateString('en-CA'),
      color: this.editingReminder.color,
    };

    this._calendarService.updateReminder(reminderUpdateRequest).subscribe(() => {});
    //reset newEvent
    this.newReminder = {
      title: '',
      content: '',
      color: ReminderColor.USER_CREATED_REMINDER_COLOR,
      type: ReminderType.USER_CREATED_REMINDER,
    };
    //close modal
    this.showReminderModal = false;
  }

  deleteEvent(event: ReminderResponse) {
    if (event.type == ReminderType.USER_DUE_DATE) {
      return;
    }
    this.newReminder = {
      title: '',
      content: '',
      color: ReminderColor.USER_CREATED_REMINDER_COLOR,
      type: ReminderType.USER_CREATED_REMINDER,
    };
    this._calendarService.deleteReminder(event.reminder_id).subscribe(() => {});
    //đóng modal
    this.showReminderModal = false;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }
}
