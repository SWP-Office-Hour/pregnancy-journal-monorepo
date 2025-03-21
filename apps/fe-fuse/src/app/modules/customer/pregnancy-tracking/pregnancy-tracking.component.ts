import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildType } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { RecordChartComponent } from './record-chart/record-chart.component';
import { RecordTableComponent } from './record-table/record-table.component';
import { TrackingMiniCalendarComponent } from './tracking-mini-calendendar/tracking-mini-calendar.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [RecordTableComponent, FormsModule, Toast, TrackingMiniCalendarComponent, RecordChartComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
  providers: [MessageService],
})
export class PregnancyTrackingComponent {
  child: ChildType;
  constructor(private childService: ChildV2Service) {}

  ngOnInit() {
    // Lấy thông tin child, ví dụ:
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }
}
