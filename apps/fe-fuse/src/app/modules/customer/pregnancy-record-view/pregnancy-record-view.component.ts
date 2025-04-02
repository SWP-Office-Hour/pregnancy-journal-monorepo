import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataMetric, MediaResponse, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PregnancyRecordViewService } from './pregnancy-record-view.service';

@Component({
  selector: 'app-pregnancy-record-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregnancy-record-view.component.html',
})
export class PregnancyRecordViewComponent implements OnInit {
  record$: Observable<RecordResponse>;
  metricArray: MetricResponseType[];
  recordId: string;
  isLoading = true;

  constructor(
    private _route: ActivatedRoute,
    private _recordViewService: PregnancyRecordViewService,
    private _httpClient: HttpClient,
  ) {}

  ngOnInit(): void {
    this.recordId = this._route.snapshot.queryParamMap.get('record_id') || '';

    if (this.recordId) {
      console.log('recordId', this.recordId);
      this.record$ = this._recordViewService.getRecordById(this.recordId).pipe(
        map((record) => {
          this.isLoading = false;
          const media = [];
          record.media.forEach((img) => {
            this._httpClient.get(environment.apiUrl + 'media/' + img.media_id, {}).subscribe((res: { media: MediaResponse; imgLink: string }) => {
              media.push({
                media_id: res.media.media_id,
                media_url: res.imgLink,
              });
            });
          });

          record.media = media;
          return record;
        }),
      );

      this._recordViewService
        .getMetric()
        .pipe(
          tap((metrics) => {
            this.metricArray = metrics.filter((metric) => metric.status == Status.ACTIVE);
          }),
        )
        .subscribe();
    }
  }

  getMetricValue(data: DataMetric[]) {
    return this.metricArray.map((metric) => {
      const active_data = data.find((d) => d.metric_id === metric.metric_id);
      return {
        ...metric,
        value: active_data?.value ?? 0,
      };
    });
  }
}
