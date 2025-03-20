import { DatePipe, NgClass, NgForOf } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { LineChartComponent } from '../../../common/line-chart/line-chart.component';
import { PregnancyTrackingService } from './pregnancy-tracking.service';
import { RecordTableComponent } from './record-table/record-table.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [LineChartComponent, RecordTableComponent, FormsModule, Toast, DatePipe, NgForOf, NgClass],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
  providers: [MessageService],
})
export class PregnancyTrackingComponent {
  protected recordsData: WritableSignal<RecordResponse[]> = signal([]);
  protected metrics: MetricResponseType[];
  protected weekDays: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  protected currentDate: Date = new Date();
  protected selectedDate: Date = new Date();
  protected calendarDays: Date[];

  constructor(private _trackingService: PregnancyTrackingService) {
    this.generateCalendarDays();
    this._trackingService.RecordData.subscribe((data) => {
      this.recordsData = data;
    });
    this._trackingService.getMetrics().subscribe((data) => {
      this.metrics = data.filter((m) => m.status != Status.INACTIVE);
    });
  }

  getRecordDataForChart() {
    const data_for_chart: {
      name: string;
      data: { timestamp: DateTime; value: number }[];
    }[] = this.metrics.map((metric) => {
      return {
        name: metric.title,
        data: [],
      };
    });

    this.recordsData().forEach((record) => {
      record.data.forEach((data) => {
        const metric = this.metrics.find((m) => m.metric_id == data.metric_id);
        if (metric) {
          const [value, value_extended] = data.value.split('/');
          if (value_extended) {
            data_for_chart
              .find((d) => d.name == metric.title)!
              .data.push({
                timestamp: DateTime.fromISO(new Date(record.visit_doctor_date).toISOString()),
                value: Number(value_extended),
              });
          }
          data_for_chart
            .find((d) => d.name == metric.title)!
            .data.push({
              timestamp: DateTime.fromISO(new Date(record.visit_doctor_date).toISOString()),
              value: Number(value),
            });
        }
      });
    });

    return data_for_chart;
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

interface RecordDataForChart {
  name: string;
  data: { timestamp: DateTime; value: number }[];
}
