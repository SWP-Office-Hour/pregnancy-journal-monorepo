import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { LineChartComponent } from '../../../common/line-chart/line-chart.component';
import { RecordTableComponent } from './record-table/record-table.component';
import { TrackingMiniCalendarComponent } from './tracking-mini-calendendar/tracking-mini-calendar.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [LineChartComponent, RecordTableComponent, FormsModule, Toast, TrackingMiniCalendarComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
  providers: [MessageService],
})
export class PregnancyTrackingComponent {
  constructor() {}
}
