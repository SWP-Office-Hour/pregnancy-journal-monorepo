import { CommonModule } from '@angular/common';
import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReminderResponse, ReminderType } from '@pregnancy-journal-monorepo/contract';
import { DateTime, Info, Interval } from 'luxon';
import { CalendarService } from './calendar.service';
import { CreateCalendarComponent } from './create-calendar/create-calendar.component';

@Component({
  selector: 'app-calendar',
  imports: [
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatButton,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  selected_date = new FormControl(DateTime.local());
  selected_date_as_string = new FormControl('');
  meetings: WritableSignal<ReminderResponse[]> = this._calendarService.meetings;
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));
  activeDay = this._calendarService.activeDay;
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(this.firstDayOfActiveMonth().startOf('week'), this.firstDayOfActiveMonth().endOf('month').endOf('week'))
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start === null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });
  DATE_MED = DateTime.DATE_MED;
  activeDayMeetings: Signal<ReminderResponse[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      return [];
    }

    const meetingDate = this.meetings().filter((meeting) => meeting.remind_date.toISOString().slice(0, 10) === activeDayISO);
    return meetingDate.length ? meetingDate : [];
  });
  protected open = signal(false);

  constructor(
    private _calendarService: CalendarService,
    private _matDialog: MatDialog,
  ) {
    this.selected_date_as_string.setValue(`${this.today().monthLong} ${this.today().year}`);
    this.selected_date.valueChanges.subscribe((date) => {
      if (date) {
        this.firstDayOfActiveMonth.set(DateTime.fromObject({ month: date.month, year: date.year }).startOf('month'));
        this.selected_date_as_string.setValue(`${date.monthLong} ${date.year}`);
      }
    });
  }

  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth().minus({ month: 1 }));
    this.selected_date.setValue(this.firstDayOfActiveMonth());
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth().plus({ month: 1 }));
    this.selected_date.setValue(this.firstDayOfActiveMonth());
  }

  goToToday(): void {
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
    this.selected_date.setValue(this.firstDayOfActiveMonth());
  }

  clickSelector() {
    this.open.set(!this.open());
  }

  protected clickDate(dayOfMonth: DateTime) {
    if (this.IsActiveDay(dayOfMonth)) {
      this._calendarService.activeDay = null;
    } else {
      this._calendarService.activeDay = dayOfMonth;
    }
  }

  protected getMeetingByDate(date: DateTime) {
    return this._calendarService.getMeetingByDate(date);
  }

  protected createMeeting() {
    this._matDialog.open(CreateCalendarComponent, {
      autoFocus: false,
    });
  }

  protected dateInActiveMonth(date: DateTime): boolean {
    return date.month === this.firstDayOfActiveMonth().month;
  }

  protected IsActiveDay(date: DateTime): boolean {
    return date.toISODate() === this.activeDay()?.toISODate();
  }

  protected IsToday(date: DateTime): boolean {
    return date.toISODate() === this.today().toISODate();
  }

  protected readonly ReminderType = ReminderType;
}
