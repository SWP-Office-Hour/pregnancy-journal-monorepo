import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { Component, effect, LOCALE_ID, ResourceStatus, Signal, signal } from '@angular/core';
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
  providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' }, // Set default locale to Vietnamese
  ],
})
export class CalendarComponent {
  constructor(private _calendarService: CalendarService) {
    this.events = this._calendarService.meetings.value;
    this.status = this._calendarService.meetings.status;
    effect(() => {
      if (this.status() == ResourceStatus.Resolved || this.status() == ResourceStatus.Local) {
        this.generateCalendarDays();
      }
    });
  }

  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  calendarDays: Date[];
  weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  events = signal<ReminderResponse[]>([]);
  status: Signal<ResourceStatus> = signal(ResourceStatus.Idle);

  showEventModal: boolean = false;
  newEvent: ReminderResponse = {
    title: '',
    content: '',
    remind_date: new Date(),
    color: ReminderColor.USER_CREATED_EVENT_COLOR,
    type: ReminderType.USER_CREATED_EVENT,
  };
  themes: Theme[] = [
    { title: 'Khám thai', color: 'f9a8d4' }, // Soft pink
    { title: 'Uống thuốc', color: 'c4b5fd' }, // Soft lavender
    { title: 'Tiêm phòng', color: '93c5fd' }, // Soft blue
    { title: 'Siêu âm', color: 'a7f3d0' }, // Soft mint
    { title: 'Xét nghiệm', color: 'fcd34d' }, // Soft yellow
  ];

  isEditMode = 0;
  isHovering: boolean = false;
  // Add a property to track the event being edited
  editingEvent: ReminderResponse = { title: '', content: '', remind_date: new Date(), color: '', type: ReminderType.USER_CREATED_EVENT };

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create a properly typed array for calendar days
    const dateEvents: Array<{ date: Date; events: any[] }> = [];

    // Calculate days needed from previous month
    const startPadding = firstDay.getDay();

    // Add previous month's days
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1);
      // Check if there are existing events for this date
      const existingEvents = this.getEventsForDate(prevDate);
      dateEvents.push({ date: prevDate, events: existingEvents });
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      // Check if there are existing events for this date
      const existingEvents = this.getEventsForDate(currentDate);
      dateEvents.push({ date: currentDate, events: existingEvents });
    }

    // Calculate how many days we need from next month to complete the grid
    // A standard calendar display needs 6 rows of 7 days = 42 total cells
    const totalCells = 42;
    const endPadding = totalCells - dateEvents.length;

    // Add next month's days
    for (let i = 1; i <= endPadding; i++) {
      const nextDate = new Date(year, month + 1, i);
      // Check if there are existing events for this date
      const existingEvents = this.getEventsForDate(nextDate);
      dateEvents.push({ date: nextDate, events: existingEvents });
    }
    this.calendarDays = dateEvents.map((item) => item.date);
  }

  // Helper function to find events for a specific date
  getEventsForDate(date: Date): ReminderResponse[] {
    //check events có tồn tại không
    if (!this.events()) {
      return [];
    }
    // Find existing events
    return !date ? [] : this.events()?.filter((event) => this.getDateKey(event.remind_date) == this.getDateKey(date));
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

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
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
    return this.events()?.some((event) => this.isSameDay(event.remind_date, date) && event.type == ReminderType.USER_DUE_DATE);
  }

  createEvent() {
    // Using the template-driven form validation
    if (this.newEvent.title && this.newEvent.title.length >= 3) {
      if (this.isEditMode && this.editingEvent) {
        // Update existing event using the stored reference instead of trying to match by title
        this.events.update((events) => {
          return events.map((e) => {
            // Find the event by reference, not by properties
            if (e === this.editingEvent) {
              return { ...this.newEvent }; // Replace with updated data
            }
            return e;
          });
        });
      } else {
        // Create a new event (existing code)
        const eventCopy: ReminderCreateRequest = {
          title: this.newEvent.title,
          content: this.newEvent.content || '',
          remind_date: new Date(this.selectedDate).toLocaleDateString('en-CA'),
          color: this.newEvent.color || ReminderColor.USER_CREATED_EVENT_COLOR,
          type: this.newEvent.type || ReminderType.USER_CREATED_EVENT,
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
    this.newEvent.remind_date = new Date(this.selectedDate);
    this.isEditMode = 0; // Reset to create mode

    // Set a timeout before showing the modal for a smoother effect
    setTimeout(() => {
      this.showEventModal = true;
    }, 10);
  }

  closeCreateEventModal() {
    // Hide the modal first
    this.showEventModal = false;

    // Reset the form after the animation completes
    setTimeout(() => {
      this.newEvent = {
        title: '',
        remind_date: new Date(),
        color: ReminderColor.USER_CREATED_EVENT_COLOR,
      };
      this.isEditMode = 0;
      this.editingEvent = { title: '', content: '', remind_date: new Date(), color: '', type: ReminderType.USER_CREATED_EVENT }; // Clear the reference to the edited event
    }, 300);
  }

  chooseColor(event: ReminderResponse): string {
    if (!event.color) {
      if (event.type == ReminderType.USER_CREATED_EVENT) {
        return '#' + ReminderColor.USER_CREATED_EVENT_COLOR;
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
          type: ReminderType.USER_CREATED_EVENT,
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
      this.events.update((events) => {
        events.push(newEvent);
        return events;
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
    this.newEvent = { ...event };
    this.isEditMode = status;
    this.editingEvent = event; // Store a reference to the edited event

    // Set a timeout before showing the modal for a smoother effect
    setTimeout(() => {
      this.showEventModal = true;
    }, 10);
  }

  updateEvent() {
    //store the updated event
    if (this.newEvent.title) {
      this.editingEvent.title = this.newEvent.title;
    }
    if (this.newEvent.content) {
      this.editingEvent.content = this.newEvent.content;
    }
    if (this.newEvent.color) {
      this.editingEvent.color = this.newEvent.color;
    }

    //convert to ReminderUpdateRequest
    const reminderUpdateRequest: ReminderUpdateRequest = {
      reminder_id: this.editingEvent.reminder_id,
      title: this.editingEvent.title,
      content: this.editingEvent.content,
      remind_date: new Date(this.editingEvent.remind_date).toLocaleDateString('en-CA'),
      color: this.editingEvent.color,
    };

    this._calendarService.updateReminder(reminderUpdateRequest).subscribe(() => {});
    //reset newEvent
    this.newEvent = {
      title: '',
      content: '',
      color: ReminderColor.USER_CREATED_EVENT_COLOR,
      type: ReminderType.USER_CREATED_EVENT,
    };
    //close modal
    this.showEventModal = false;
  }

  deleteEvent(event: ReminderResponse) {
    if (event.type == ReminderType.USER_DUE_DATE) {
      return;
    }
    this.newEvent = {
      title: '',
      content: '',
      color: ReminderColor.USER_CREATED_EVENT_COLOR,
      type: ReminderType.USER_CREATED_EVENT,
    };
    this._calendarService.deleteReminder(event.reminder_id).subscribe(() => {});
    //đóng modal
    this.showEventModal = false;
  }

  protected readonly ReminderType = ReminderType;
}
