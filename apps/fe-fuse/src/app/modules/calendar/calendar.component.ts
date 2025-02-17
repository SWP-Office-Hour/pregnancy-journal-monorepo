import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateTime, Info, Interval } from 'luxon';
import { Meetings } from './meetings.interface';

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
  meetings: InputSignal<Meetings> = input.required();
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));
  activeDay: WritableSignal<DateTime | null> = signal(null);
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
  activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      return [];
    }

    return this.meetings()[activeDayISO] ?? [];
  });
  protected open = signal(false);

  constructor() {
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
    console.log('goToPreviousMonth');
    console.log(this.firstDayOfActiveMonth());
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth().plus({ month: 1 }));
  }

  goToToday(): void {
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
  }

  clickSelector() {
    this.open.set(!this.open());
  }

  protected clickDate(dayOfMonth: DateTime) {
    console.log(dayOfMonth);
    console.log(this.activeDay());
    console.log(this.activeDay()?.toISODate() === dayOfMonth.toISODate());
  }
}
