import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReminderColor, ReminderType } from '@pregnancy-journal-monorepo/contract';
import { Button, ButtonModule } from 'primeng/button';

interface Event {
  title: string;
  content?: string;
  date: Date;
  color?: string; // Add color property to Event interface
  type?: ReminderType.USER_CREATED_EVENT;
}

interface Theme {
  title: string;
  color: string;
}

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
})
export class CalendarComponent implements OnInit {
  // selected_date = new FormControl(DateTime.local());
  // selected_date_as_string = new FormControl('');
  // meetings: WritableSignal<ReminderResponse[]> = this._calendarService.meetings;
  // today: Signal<DateTime> = signal(DateTime.local());
  // firstDayOfActiveMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));
  // activeDay = this._calendarService.activeDay;
  // weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  // daysOfMonth: Signal<DateTime[]> = computed(() => {
  //   return Interval.fromDateTimes(this.firstDayOfActiveMonth().startOf('week'), this.firstDayOfActiveMonth().endOf('month').endOf('week'))
  //     .splitBy({ day: 1 })
  //     .map((d) => {
  //       if (d.start === null) {
  //         throw new Error('Wrong dates');
  //       }
  //       return d.start;
  //     });
  // });
  // DATE_MED = DateTime.DATE_MED;
  // activeDayMeetings: Signal<ReminderResponse[]> = computed(() => {
  //   const activeDay = this.activeDay();
  //   if (activeDay === null) {
  //     return [];
  //   }
  //   const activeDayISO = activeDay.toISODate();
  //
  //   if (!activeDayISO) {
  //     return [];
  //   }
  //
  //   const meetingDate = this.meetings().filter((meeting) => meeting.remind_date.toISOString().slice(0, 10) === activeDayISO);
  //   return meetingDate.length ? meetingDate : [];
  // });
  // protected showMobileMenu = false;
  // protected readonly ReminderType = ReminderType;
  //
  // constructor(
  //   private _calendarService: CalendarService,
  //   private _matDialog: MatDialog,
  // ) {
  //   this.selected_date_as_string.setValue(`${this.today().monthLong} ${this.today().year}`);
  //   this.selected_date.valueChanges.subscribe((date) => {
  //     if (date) {
  //       this.firstDayOfActiveMonth.set(DateTime.fromObject({ month: date.month, year: date.year }).startOf('month'));
  //       this.selected_date_as_string.setValue(`${date.monthLong} ${date.year}`);
  //       this.selectDay(date);
  //     }
  //   });
  // }

  // goToPreviousMonth(): void {
  //   this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth().minus({ month: 1 }));
  //   this.selected_date.setValue(this.firstDayOfActiveMonth());
  // }
  //
  // goToNextMonth(): void {
  //   this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth().plus({ month: 1 }));
  //   this.selected_date.setValue(this.firstDayOfActiveMonth());
  // }
  //
  // goToToday(): void {
  //   this.firstDayOfActiveMonth.set(this.today().startOf('month'));
  //   this.selected_date.setValue(this.firstDayOfActiveMonth());
  // }
  //
  // protected selectDay(dayOfMonth: DateTime) {
  //   if (this.IsActiveDay(dayOfMonth)) {
  //     this._calendarService.activeDay = null;
  //   } else {
  //     this._calendarService.activeDay = dayOfMonth;
  //   }
  // }
  //
  // protected getMeetingByDate(date: DateTime) {
  //   return this._calendarService.getMeetingByDate(date);
  // }
  //
  // protected createMeeting() {
  //   this._calendarService.clearReminder();
  //   this._matDialog.open(ReminderEditorComponent, {
  //     autoFocus: false,
  //   });
  // }
  //
  // protected dateInActiveMonth(date: DateTime): boolean {
  //   return date.month === this.firstDayOfActiveMonth().month;
  // }
  //
  // protected IsActiveDay(date: DateTime): boolean {
  //   return date.toISODate() === this.activeDay()?.toISODate();
  // }
  //
  // protected IsToday(date: DateTime): boolean {
  //   return date.toISODate() === this.today().toISODate();
  // }
  //
  // editMeeting(reminderId: string) {
  //   this._calendarService.reminder = this.meetings().find((meeting) => meeting.reminder_id === reminderId)!;
  //   this._matDialog.open(ReminderEditorComponent, {
  //     autoFocus: false,
  //   });
  // }

  //MiniCalendarComponent
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
  themes: Theme[] = [];
  eventForm: FormGroup;
  removeAfterDrop = false;
  createThemeAfterCreateEvent = false;

  ngOnInit() {
    this.generateCalendarDays();
    this.loadThemes();
  }

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
      // Make a deep copy of the event to avoid reference issues
      const eventCopy: Event = {
        title: this.newEvent.title,
        content: this.newEvent.content || '',
        date: new Date(this.selectedDate), // Ensure we use the selected date
        color: this.newEvent.color || ReminderColor.USER_CREATED_EVENT_COLOR,
        type: ReminderType.USER_CREATED_EVENT,
      };

      // Add the event to our events array
      this.events.update((events) => {
        events.push(eventCopy);
        return events;
      });

      // Create a theme if the checkbox is checked
      if (this.createThemeAfterCreateEvent) {
        this.createTheme();
      }

      // Update the UI to show the new event
      this.updateSelectedDateEvents();

      // Show success feedback (optional)
      console.log('Event created successfully!', eventCopy);

      // Close the modal
      this.closeCreateEventModal();
    } else {
      // Handle invalid event - show error message or highlight required fields
      console.error('Invalid event data. Please check form fields.');
    }
  }

  //lấy list màu từ enum
  getReminderColors(): ReminderColor[] {
    return Object.values(ReminderColor);
  }

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }
  loadThemes(): void {
    const uniqueTitles = new Set();
    this.events().forEach((event) => {
      if (event.type === ReminderType.USER_CREATED_EVENT && !uniqueTitles.has(event.title)) {
        uniqueTitles.add(event.title);
        this.themes.push({
          title: event.title,
          color: event.color,
        });
      }
    });
  }

  openCreateEventModal() {
    // Prepare the new event with the selected date
    this.newEvent.date = new Date(this.selectedDate);

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
      this.eventForm.reset();
    }, 300);
  }

  chooseColor(color: string): string {
    return '#' + color;
  }

  createTheme(): void {
    const newTheme: Theme = {
      title: this.newEvent.title,
      color: this.newEvent.color,
    };
    this.themes.push(newTheme);
    this.eventForm.reset();
    console.log(this.themes);
  }

  deleteTheme(theme: Theme): void {
    const index = this.themes.findIndex((t) => t.title === theme.title);
    if (index !== -1) {
      // Remove the theme
      this.themes.splice(index, 1);

      // Update related events
      this.events.update((events) => {
        return events.map((event) => {
          if (event.title === theme.title && event.type === ReminderType.USER_CREATED_EVENT) {
            return {
              ...event,
              type: ReminderType.USER_CREATED_EVENT,
            };
          }
          return event;
        });
      });
    }
  }

  drop(event: CdkDragDrop<Theme[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.themes, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  dropEvent(event: CdkDragDrop<Event[]>, targetDate: Date) {
    if (event.previousContainer === event.container) {
      // Reordering in the same date
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving to another date
      // Get the dragged event
      const draggedEvent = event.previousContainer.data[event.previousIndex];

      // Remove from previous date and add to new date
      if (this.removeAfterDrop) {
        // FIXED LOGIC: If removeAfterDrop is FALSE, we don't remove the event
        // When the "Tái sử dụng" checkbox is checked, we want to REMOVE the event (not keep it)
        const newTheme: Theme = {
          title: draggedEvent.title,
          color: draggedEvent.color,
        };
        // Add to events array
        this.themes.push(newTheme);
      }
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Update the date of the transferred event
      event.container.data[event.currentIndex].date = new Date(targetDate);

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

      // FIXED LOGIC: If removeAfterDrop is TRUE, we remove the theme
      // When the "Tái sử dụng" checkbox is checked, we want to KEEP the theme (not remove it)
      if (this.removeAfterDrop) {
        this.themes.splice(event.previousIndex, 1);
      }
    } else {
      // Regular drag and drop within themes list
      if (event.previousContainer === event.container) {
        moveItemInArray(this.themes, event.previousIndex, event.currentIndex);
      }
    }
  }
}
