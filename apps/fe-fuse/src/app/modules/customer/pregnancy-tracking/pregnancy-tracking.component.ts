import { DatePipe } from '@angular/common';
import { Component, effect, OnInit, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChildType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { LineChartComponent, LineChartOptions } from '../../../common/line-chart/line-chart.component';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { membershipService } from '../../../core/membership/membership.service';
import { UserService } from '../../../core/user/user.service';
import { TrackingFormComponent } from './form/tracking-form.component';
import { PregnancyTrackingV2Service } from './pregnancy-tracking-v2.service';
import { RecordTableComponent } from './record-table/record-table.component';
import { TrackingMiniCalendarComponent } from './tracking-mini-calendendar/tracking-mini-calendar.component';

interface RecordWithWarning {
  record: RecordResponse;
  warnings: string[];
}

@Component({
  selector: 'app-pregnancy-service',
  imports: [RecordTableComponent, FormsModule, Toast, TrackingMiniCalendarComponent, NgAutoAnimateDirective, DatePipe, LineChartComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
  providers: [MessageService],
})
export class PregnancyTrackingComponent implements OnInit {
  child: ChildType;
  records = signal<RecordResponse[]>([]);
  recordsWithWarning = resource<RecordWithWarning[], []>({
    loader: async ({ abortSignal }) => {
      const result = await Promise.all(
        this.records().map(async (record) => {
          const warnings = await this.getWarningMessage(record.visit_record_id, abortSignal);
          console.log(warnings);
          return { record, warnings };
        }),
      );
      console.log(result);
      return result.filter((x) => x.warnings.length > 0);
    },
  });
  metricDataArrayResource = signal<{ options: LineChartOptions; metricId: string }[]>([]);

  private _dialog: MatDialog;

  constructor(
    private childService: ChildV2Service,
    private _trackingService: PregnancyTrackingV2Service,
    private _userService: UserService,
    private _membershipService: membershipService,
  ) {
    this.records = this._trackingService.records.value;
    this.metricDataArrayResource = this._trackingService.metricDataArrayResource.value;
    effect(() => {
      if (this.records().length > 0) {
        this.recordsWithWarning.reload();
        this._trackingService.metricDataArrayResource.reload();
      } else {
        this.recordsWithWarning.value.set([]);
      }
    });
  }

  ngOnInit() {
    // Lấy thông tin child, ví dụ:
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }

  getNewestRecord() {
    return this._trackingService.getNewestRecord();
  }

  createRecord() {
    this._trackingService.SelectRecordData('');
    this._userService.checkMember().subscribe((membership) => {
      if (!membership) {
        this._membershipService.buy_membership.set(true);
        return;
      } else {
        const dialogRef = this._dialog.open(TrackingFormComponent, {
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(() => {
          this._trackingService.records.reload();
          this._trackingService.closeForm();
        });
      }
    });
  }

  async getWarningMessage(record_id: string, abortSignal: AbortSignal) {
    return await fetch(environment.apiUrl + 'record/warning/' + record_id, {
      signal: abortSignal,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then((res) => res.json());
  }

  getMetricTitle(metricId: string): string {
    const metric = this._trackingService.metrics.value().find((metric) => metric.metric_id === metricId);
    return metric ? metric.title : '';
  }
}
