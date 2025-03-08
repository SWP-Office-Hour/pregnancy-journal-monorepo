import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    CdkDrag,
    CdkDropList,
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
  //
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
  calendarDays: Date[] = [];
  weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  events: Event[] = [];
  selectedDateEvents: Event[] = [];
  showEventModal: boolean = false;
  newEvent: Event = {
    title: '',
    type: 'All Day Event',
    time: '',
    date: new Date(),
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

    const days: Date[] = [];
    const startPadding = firstDay.getDay();

    // Add previous month's days
    for (let i = 0; i < startPadding; i++) {
      days.push(new Date(year, month, -startPadding + i + 1));
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days to fill grid
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    this.calendarDays = days;
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
    this.selectedDateEvents = this.events.filter((event) => this.isSameDay(event.date, this.selectedDate));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  isCurrentDate(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  loadEvents() {
    this.events = [
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
    ];
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
    return this.events.some((event) => event.date.toDateString() === date.toDateString());
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
      this.events.push({ ...this.newEvent });
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

  /**
   * Handle drop event when a theme is dropped on a calendar date
   * @param event The drop event
   */
  // dropInCalendar(event: CdkDragDrop<any>): void {
  //   const reminderDate = DateTime.local();
  //   // Get the theme that was dragged
  //   const theme = this.themes[event.previousIndex];

  //   // Create a new event using the theme's name and color
  //   const newEvent = {
  //     title: theme.name,
  //     type: 'All Day Event', // Default event type
  //     time: '12:00', // Default time
  //     date: date,
  //     color: theme.color,
  //   };

  //   // Add the event to the collection
  //   this.selectedDateEvents.push(newEvent);

  //   // If removeAfterDrop is true, remove the theme
  //   if (this.removeAfterDrop) {
  //     this.themes.splice(event.previousIndex, 1);
  //   }

  //   // Update the UI to show the new event
  //   this.selectDate(date);
  // }
}
