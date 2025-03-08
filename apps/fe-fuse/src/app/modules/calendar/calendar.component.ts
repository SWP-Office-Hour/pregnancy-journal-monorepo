import { CdkDragDrop, CdkDragEnter, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Button, ButtonModule } from 'primeng/button';

interface Event {
  title: string;
  type: string;
  time: string;
  date: Date;
  color?: string; // Add color property to Event interface
}

interface Theme {
  id: number;
  name: string;
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
    type: 'All Day Event',
    time: '',
    date: new Date(),
  };

  // Event type to color mapping
  eventTypeColors = {
    'All Day Event': '#60a5fa',
    Conference: '#8b5cf6',
    Dinner: '#f43f5e',
    Meeting: '#10b981',
    Birthday: '#f59e0b',
  };

  ngOnInit() {
    this.generateCalendarDays();
    this.loadEvents();
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
    console.log(this.calendarEvents);
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

  // Get color for event type
  getEventColor(type: string): string {
    return this.eventTypeColors[type] || '#94a3b8'; // Default to slate
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

  isCurrentDate(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  loadEvents() {
    this.events.set([
      {
        title: 'Team Meeting',
        type: 'Conference',
        time: '10:00',
        date: new Date(),
      },
      {
        title: 'Client Dinner',
        type: 'Dinner',
        time: '19:00',
        date: new Date(),
      },
    ]);
    this.updateSelectedDateEvents();
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

  hasEvents(date: Date): boolean {
    return this.events().some((event) => event.date.toDateString() === date.toDateString());
  }

  getEventTypeClass(type: string): string {
    switch (type) {
      case 'All Day Event':
        return 'bg-sky-50 border border-sky-100';
      case 'Conference':
        return 'bg-violet-50 border border-violet-100';
      case 'Dinner':
        return 'bg-rose-50 border border-rose-100';
      case 'Meeting':
        return 'bg-emerald-50 border border-emerald-100';
      case 'Birthday':
        return 'bg-amber-50 border border-amber-100';
      default:
        return 'bg-slate-50 border border-slate-100';
    }
  }

  getEventTagClass(type: string): string {
    switch (type) {
      case 'All Day Event':
        return 'bg-sky-100 text-sky-700';
      case 'Conference':
        return 'bg-violet-100 text-violet-700';
      case 'Dinner':
        return 'bg-rose-100 text-rose-700';
      case 'Meeting':
        return 'bg-emerald-100 text-emerald-700';
      case 'Birthday':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  openCreateEventModal() {
    this.showEventModal = true;
    this.newEvent.date = this.selectedDate;
  }

  closeCreateEventModal() {
    this.showEventModal = false;
    this.newEvent = {
      title: '',
      type: 'All Day Event',
      time: '',
      date: new Date(),
    };
  }

  createEvent() {
    if (this.newEvent.title && this.newEvent.time) {
      this.events.update((events) => {
        events.push(this.newEvent);
        return events;
      });
      this.updateSelectedDateEvents();
      this.closeCreateEventModal();
    }
  }

  //Drag and drop
  themes: Theme[] = [];
  showModal = false;
  themeForm: FormGroup;
  removeAfterDrop = false;

  predefinedColors = ['#A0C4FF', '#CAFFBF', '#D8C4FF', '#FFD4A0', '#FFBFCB'];

  constructor(private fb: FormBuilder) {
    this.themeForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  loadThemes(): void {
    const savedThemes = localStorage.getItem('themes');
    if (savedThemes) {
      this.themes = JSON.parse(savedThemes);
    }
  }

  saveThemes(): void {
    localStorage.setItem('themes', JSON.stringify(this.themes));
  }

  openThemeModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.themeForm.reset();
  }

  selectColor(color: string): void {
    this.themeForm.patchValue({ color });
  }

  createTheme(): void {
    if (this.themeForm.valid) {
      const newTheme: Theme = {
        id: Date.now(),
        name: this.themeForm.value.name,
        color: this.themeForm.value.color,
      };

      this.themes.push(newTheme);
      this.saveThemes();
      this.closeModal();
    }
  }

  deleteTheme(theme: Theme): void {
    this.themes = this.themes.filter((t) => t.id !== theme.id);
    this.saveThemes();
  }

  drop(event: CdkDragDrop<Theme[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.themes, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.saveThemes(); // Save the updated order to localStorage
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
        title: theme.name,
        type: 'All Day Event', // Default type
        time: '12:00', // Default time
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

      // If removeAfterDrop is enabled, remove the theme
      if (this.removeAfterDrop) {
        this.themes.splice(event.previousIndex, 1);
        this.saveThemes();
      }
    } else {
      // Regular drag and drop within themes list
      if (event.previousContainer === event.container) {
        moveItemInArray(this.themes, event.previousIndex, event.currentIndex);
        this.saveThemes();
      }
    }
  }

  currentHoveredList: any = null;

  onDragEntered(event: CdkDragEnter, list: any) {
    this.currentHoveredList = list;
  }

  onDrop(event: CdkDragDrop<any[]>, parentList: any) {
    if (this.currentHoveredList && this.currentHoveredList !== parentList) {
      // Chuyển item từ list cũ sang list con được hover
      transferArrayItem(event.container.data, this.currentHoveredList.items, event.previousIndex, 0);
      console.log('Item đã được drop vào:', this.currentHoveredList);
    }
  }

  protected readonly Date = Date;
  protected readonly console = console;
}
