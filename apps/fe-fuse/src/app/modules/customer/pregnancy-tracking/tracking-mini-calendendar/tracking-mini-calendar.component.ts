import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tracking-mini-calendar',
  imports: [CommonModule],
  templateUrl: './tracking-mini-calendar.component.html',
  styleUrl: './tracking-mini-calendar.component.css',
  animations: [
    trigger('imageTransition', [
      transition('* => *', [style({ opacity: 0, transform: 'scale(0.8)' }), animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
    ]),

    trigger('countChange', [
      transition('* => *', [style({ opacity: 0, transform: 'scale(0.8)' }), animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
    ]),
  ],
})
export class TrackingMiniCalendarComponent {
  protected weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  protected currentDate: Date = new Date();
  protected selectedDate: Date = new Date();
  protected calendarDays: Date[] = [];

  //giả data
  protected _expectedDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 9));
  @Input() set expectedDate(date: Date) {
    this._expectedDate = new Date(date);
  }
  //countdown
  private _currentPregnancyWeek: number = 4;
  remainingDays() {
    const expectedDate = new Date(this._expectedDate);
    const currentDate = new Date();
    if (expectedDate.getTime() < currentDate.getTime()) {
      return 0;
    }
    console.log('expectedDate', expectedDate);
    return Math.floor((expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  protected get currentPregnancyWeek(): number {
    return this._currentPregnancyWeek;
  }

  constructor() {
    // Always initialize with full month view
    this.generateMonthView();
  }

  // Navigation now always moves by months
  navigateMonth(offset: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset, 1);
    this.generateMonthView();
  }

  // Generate a full month view
  generateMonthView(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Clear existing calendar days
    this.calendarDays = [];

    // Calculate days needed from previous month
    const startPadding = firstDay.getDay();

    // Add previous month's days
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1);
      this.calendarDays.push(prevDate);
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      this.calendarDays.push(currentDate);
    }

    // Calculate how many days we need from next month to complete the grid
    // A standard calendar display needs 6 rows of 7 days = 42 total cells
    const totalCells = 42;
    const endPadding = totalCells - this.calendarDays.length;

    // Add next month's days
    for (let i = 1; i <= endPadding; i++) {
      const nextDate = new Date(year, month + 1, i);
      this.calendarDays.push(nextDate);
    }
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
    // Add a slight delay for better animation effect
    setTimeout(() => {
      this.selectedDate = date;
      // We can update currentDate to the selected date if needed
      this.currentDate = new Date(date);
    }, 150);
  }

  // Function to navigate to today's date
  goToToday(): void {
    // Create animation effect with a slight delay
    setTimeout(() => {
      this.currentDate = new Date();
      this.selectedDate = new Date();
      this.generateMonthView();
    }, 100);
  }

  // Function to calculate the week of fetal development
  calculateWeekOfFetalDevelopment(): number {
    //check if expected date is set
    if (!this._expectedDate) {
      return 0;
    }
    // Tính số ngày chênh lệch giữa ngày dự sinh và ngày được chọn
    const diffInMs = this._expectedDate.getTime() - this.selectedDate.getTime();

    // Chuyển đổi số ngày thành số tuần
    const weeksRemaining = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

    // Tuần thai hiện tại = 40 - số tuần còn lại
    const currentWeek = 40 - weeksRemaining;

    // Ensure week is between 1-40 for valid images
    return currentWeek;
  }
}
