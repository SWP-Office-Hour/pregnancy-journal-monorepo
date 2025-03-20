import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tracking-mini-calendar',
  imports: [CommonModule],
  templateUrl: './tracking-mini-calendar.component.html',
  styleUrl: './tracking-mini-calendar.component.css',
})
export class TrackingMiniCalendarComponent {
  protected weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  protected currentDate: Date = new Date();
  protected selectedDate: Date = new Date();
  protected calendarDays: Date[];

  constructor() {
    this.generateCalendarDays();
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

  isDateInCurrentMonth(date: Date): boolean {
    return this.currentDate ? date.getMonth() === this.currentDate.getMonth() && date.getFullYear() === this.currentDate.getFullYear() : false;
  }
  selectDate(date: Date) {
    this.selectedDate = date;
  }
  navigateMonth(offset: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset);
    this.generateCalendarDays();
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
}
