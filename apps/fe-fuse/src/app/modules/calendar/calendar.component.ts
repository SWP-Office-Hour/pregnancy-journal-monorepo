import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { Component, LOCALE_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReminderColor, ReminderType } from '@pregnancy-journal-monorepo/contract';
import { Button, ButtonModule } from 'primeng/button';
import { CalendarService } from './calendar.service';

interface Event {
  id?: string;
  title: string;
  content?: string;
  date: Date;
  color?: string; // Add color property to Event interface
  type?: ReminderType.USER_CREATED_EVENT;
  status?: string;
}

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
  constructor(
    private fb: FormBuilder,
    private _calendarService: CalendarService,
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
    this.generateCalendarDays();
  }

  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  calendarDays: Date[];
  calendarEvents: Array<{ date: Date; events: any[] }>;
  weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  events = signal<Event[]>([]);

  selectedDateEvents: Event[] = [];
  showEventModal: boolean = false;
  newEvent: Event = {
    title: '',
    date: new Date(),
    color: ReminderColor.USER_CREATED_EVENT_COLOR,
  };
  themes: Theme[] = [
    { title: 'Khám thai', color: 'f9a8d4' }, // Soft pink
    { title: 'Uống thuốc', color: 'c4b5fd' }, // Soft lavender
    { title: 'Tiêm phòng', color: '93c5fd' }, // Soft blue
    { title: 'Siêu âm', color: 'a7f3d0' }, // Soft mint
    { title: 'Xét nghiệm', color: 'fcd34d' }, // Soft yellow
  ];
  eventForm: FormGroup;
  isEditMode: boolean = false;
  // Add a property to track the event being edited
  editingEvent: Event | null = null;

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
    // You can store the events mapping if needed
    this.calendarEvents = dateEvents;
  }

  // Helper function to find events for a specific date
  getEventsForDate(date: Date): Event[] {
    if (!date) return [];
    // Find existing events
    return !date ? [] : this.events().filter((event) => this.getDateKey(event.date) === this.getDateKey(date));
  }

  checkEventByDate({ date, event }: { date: Date; event: Event }): Boolean {
    return this.getDateKey(event.date) === this.getDateKey(date);
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
    this.updateSelectedDateEvents();
  }

  private updateSelectedDateEvents() {
    this.selectedDateEvents = this.events().filter((event) => this.isSameDay(event.date, this.selectedDate));
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
        const eventCopy: Event = {
          title: this.newEvent.title,
          content: this.newEvent.content || '',
          date: new Date(this.selectedDate),
          color: this.newEvent.color || ReminderColor.USER_CREATED_EVENT_COLOR,
          type: ReminderType.USER_CREATED_EVENT,
        };

        // Add the event to our events array
        this.events.update((events) => {
          events.push(eventCopy);
          return events;
        });
      }

      // Update the UI to show the new/updated event
      this.updateSelectedDateEvents();

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
    this.newEvent.date = new Date(this.selectedDate);
    this.isEditMode = false; // Reset to create mode

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
        date: new Date(),
        color: ReminderColor.USER_CREATED_EVENT_COLOR,
      };
      this.isEditMode = false;
      this.editingEvent = null; // Clear the reference to the edited event
      this.eventForm.reset();
    }, 300);
  }

  chooseColor(color: string): string {
    return '#' + color;
  }

  dropEvent(event: CdkDragDrop<Event[]>, targetDate: Date) {
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
        const newEvent: Event = {
          title: draggedTheme.title,
          date: new Date(targetDate),
          color: draggedTheme.color,
          type: ReminderType.USER_CREATED_EVENT,
        };

        // Add the new event to the events array
        this.events.update((events) => {
          events.push(newEvent);
          return events;
        });

        // No need to remove the theme from the themes list
      } else {
        // Normal event moving between dates
        // Get the dragged event
        const draggedEvent = event.previousContainer.data[event.previousIndex];

        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        // Update the date of the transferred event
        event.container.data[event.currentIndex].date = new Date(targetDate);
      }

      // Update selected date events if we're viewing the target date
      if (this.isSelected(targetDate)) {
        this.updateSelectedDateEvents();
      }
    }
  }

  dropTheme(event: CdkDragDrop<any[]>) {
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
      const newEvent: Event = {
        title: theme.title,
        date: new Date(targetDate),
        color: theme.color,
      };

      // Add to events array
      this.events.update((events) => {
        events.push(newEvent);
        return events;
      });

      // Update the UI
      if (this.isSelected(targetDate)) {
        this.updateSelectedDateEvents();
      }

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

  editEvent(event: Event) {
    // Store a reference to the event being edited
    this.editingEvent = event;

    // Create a copy of the event for editing
    this.newEvent = { ...event };
    this.isEditMode = true;

    // Open the modal for editing
    this.showEventModal = true;
  }

  deleteEvent(event: Event) {
    // Filter out the event to delete it
    this.events.update((events) => {
      return events.filter((e) => e !== event);
    });

    // Update the UI to reflect the changes
    this.updateSelectedDateEvents();
  }
}
