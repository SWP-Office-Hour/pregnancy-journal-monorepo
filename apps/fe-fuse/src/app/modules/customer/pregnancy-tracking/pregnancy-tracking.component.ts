import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { DatePicker } from 'primeng/datepicker';
import { LineChartComponent } from '../../../common/line-chart/line-chart.component';
import { PregnancyTrackingService } from './pregnancy-tracking.service';
import { RecordTableComponent } from './record-table/record-table.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [LineChartComponent, RecordTableComponent, DatePicker, FormsModule],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
})
export class PregnancyTrackingComponent {
  protected recordsData: WritableSignal<RecordResponse[]> = signal([]);
  protected metrics: MetricResponseType[];

  date: Date[] | undefined;

  constructor(private _trackingService: PregnancyTrackingService) {
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
          data_for_chart
            .find((d) => d.name == metric.title)!
            .data.push({
              timestamp: DateTime.fromISO(new Date(record.visit_doctor_date).toISOString()),
              value: data.value,
            });
        }
      });
    });

    return data_for_chart;
  }
}
