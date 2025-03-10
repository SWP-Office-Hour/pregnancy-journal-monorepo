import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataMetric, MediaResponse, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { Observable, tap } from 'rxjs';
import { PregnancyRecordViewService } from './pregnancy-record-view.service';

@Component({
  selector: 'app-pregnancy-record-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregnancy-record-view.component.html',
})
export class PregnancyRecordViewComponent implements OnInit {
  record$: Observable<RecordResponse>;
  media$: Observable<MediaResponse[]>;
  metrics: MetricResponseType[];
  recordId: string;
  isLoading = true;

  constructor(
    private _route: ActivatedRoute,
    private _recordViewService: PregnancyRecordViewService,
  ) {}

  ngOnInit(): void {
    this.recordId = this._route.snapshot.queryParamMap.get('record_id');

    if (this.recordId) {
      this.record$ = this._recordViewService.getRecordById(this.recordId);

      this.media$ = this._recordViewService.getMediaByRecordId(this.recordId);

      this._recordViewService
        .getMetric()
        .pipe(
          tap((metrics) => {
            this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
          }),
        )
        .subscribe();
    }
  }

  getMetricValue(data: DataMetric[]) {
    return this.metrics.map((metric) => {
      const active_data = data.find((d) => d.metric_id === metric.metric_id);
      return {
        ...metric,
        value: active_data?.value ?? 0,
      };
    });
  }
}
