import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Event {
  title: string;
  type: string;
  time: string;
  date: Date;
}
@Component({
  selector: 'app-mobile-calendar',
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-calendar.component.html',
  styleUrl: './mobile-calendar.component.css',
})
export class MobileCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Date[] = [];
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
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];
    const startPadding = firstDay.getDay();

    for (let i = 0; i < startPadding; i++) {
      days.push(new Date(year, month, -startPadding + i + 1));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    this.calendarDays = days;
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

  updateSelectedDateEvents() {
    this.selectedDateEvents = this.events.filter((event) => event.date.toDateString() === this.selectedDate.toDateString());
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendarDays();
  }

  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.generateCalendarDays();
    this.updateSelectedDateEvents();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.updateSelectedDateEvents();
  }

  isCurrentDate(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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
        return 'bg-blue-50';
      case 'Conference':
        return 'bg-purple-50';
      case 'Dinner':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  }

  getEventTagClass(type: string): string {
    switch (type) {
      case 'All Day Event':
        return 'bg-blue-100 text-blue-800';
      case 'Conference':
        return 'bg-purple-100 text-purple-800';
      case 'Dinner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
}
