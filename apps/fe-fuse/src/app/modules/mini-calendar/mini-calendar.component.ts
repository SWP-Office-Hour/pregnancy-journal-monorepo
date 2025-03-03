import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mini-calendar',
  imports: [CommonModule],
  templateUrl: './mini-calendar.component.html',
  styleUrl: './mini-calendar.component.css',
})
export class MiniCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  calendarDays: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendarDays();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay();

    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    const prevLastDay = new Date(year, month, 0);
    const prevLastDate = prevLastDay.getDate();

    const prevMonthDays: Date[] = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      prevMonthDays.push(new Date(year, month - 1, prevLastDate - i));
    }

    const currentMonthDays: Date[] = [];
    for (let i = 1; i <= lastDate; i++) {
      currentMonthDays.push(new Date(year, month, i));
    }

    const nextMonthDays: Date[] = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push(new Date(year, month + 1, i));
    }

    this.calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
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
}
