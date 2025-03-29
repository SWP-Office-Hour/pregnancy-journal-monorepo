import { HttpClient } from '@angular/common/http';
import { Injectable, resource } from '@angular/core';
import {
  ChildType,
  HospitalResponse,
  MediaResponse,
  MetricResponseType,
  MetricWithStandardResponseType,
  RecordCreateRequest,
  RecordResponse,
  RecordUpdateRequest,
  Standard,
  Status,
} from '@pregnancy-journal-monorepo/contract';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LineChartOptions, Series } from '../../../common/line-chart/line-chart.component';
import { ChildV2Service } from '../../../core/children/child.v2.service';

@Injectable({
  providedIn: 'root',
})
export class PregnancyTrackingV2Service {
  public media: MediaResponse[] = [];
  public selectedRecord: RecordResponse = null;
  public child: ChildType;
  public records = resource<RecordResponse[], []>({
    loader: async ({ abortSignal }) => {
      const res: { total: number; data: RecordResponse[] } = await fetch(environment.apiUrl + 'record', {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          child_id: this.child.child_id,
        },
      }).then((res) => res.json());
      return res.data.sort((a, b) => new Date(b.visit_doctor_date).getTime() - new Date(a.visit_doctor_date).getTime());
    },
  });
  public hospitals = resource<HospitalResponse[], []>({
    loader: async ({ abortSignal }) => {
      return await fetch(environment.apiUrl + 'hospitals', {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then((res) => res.json());
    },
  });
  public metrics = resource<MetricResponseType[], []>({
    loader: async ({ abortSignal }) => {
      return await fetch(environment.apiUrl + 'metrics/', {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then((res) => res.json());
    },
  });

  public metricDataArrayResource = resource<{ options: LineChartOptions; metricId: string }[], []>({
    loader: async ({ abortSignal }) => {
      const metricIds = [];
      const { data }: { total: number; data: RecordResponse[] } = await fetch(environment.apiUrl + 'record', {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          child_id: this.child.child_id,
        },
      }).then((res) => {
        return res.json();
      });

      data.forEach((record) => {
        record.data.forEach((data) => {
          if (!metricIds.includes(data.metric_id)) {
            metricIds.push(data.metric_id);
          }
        });
      });

      this.metrics.value().forEach((metric) => {
        if (!metricIds.includes(metric.metric_id) && metric.status != Status.INACTIVE) {
          metricIds.push(metric.metric_id);
        }
      });

      const dataAsPromises = metricIds.map(async (metricId) => {
        const userData: { x: number; y: number }[] = [];
        this.records.value().forEach((record) => {
          const data = record.data.find((value) => value.metric_id === metricId);
          if (data && data.value != '0') {
            userData.push({
              x: record.week,
              y: Number(data.value),
            });
          }
        });
        const userValue: Series = {
          name: 'Chỉ số của bạn',
          data: userData,
        };

        const metricWithStandards: MetricWithStandardResponseType = await fetch(environment.apiUrl + 'metrics/' + metricId, {
          signal: abortSignal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then((res) => res.json());

        const standardValue: Series = {
          name: 'Chỉ số chuẩn',
          data: metricWithStandards.standardArray.map((standard) => {
            return {
              x: standard.week,
              y: standard.who_standard_value,
            };
          }),
        };

        const series = [standardValue, userValue];

        return {
          options: new LineChartOptions(series),
          metricId,
        };
      });

      return await Promise.all(dataAsPromises);
    },
  });

  constructor(
    private _httpClient: HttpClient,
    private childService: ChildV2Service,
  ) {
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }

  getNewestRecord() {
    return this.records.value().sort((a, b) => new Date(b.visit_doctor_date).getTime() - new Date(a.visit_doctor_date).getTime())[0];
  }

  getStandardValue({ week, metric_id }: { metric_id: string; week: number }): Observable<Standard> {
    return this._httpClient.get<Standard[]>(environment.apiUrl + 'standards/' + metric_id).pipe(
      map((res: Standard[]) => {
        res.sort((a, b) => b.week - a.week);
        return res.find((standard) => standard.week <= week);
      }),
    );
  }

  getRecordDataByMetricId(metric_id: string) {
    return this.records.value().map((record) => {
      const data = record.data.find((value) => value.metric_id === metric_id);
      return {
        week: record.week,
        value: data ? Number(data.value) : null,
      };
    });
  }

  deleteImage(id: string) {
    this.media = this.media.filter((img) => img.media_id !== id);
    return this.media;
  }

  deleteRecord(record_id: string) {
    return this._httpClient.delete(environment.apiUrl + 'record/' + record_id).pipe(
      map((res) => {
        this.records.set(this.records.value().filter((record) => record.visit_record_id !== record_id));
        return res;
      }),
    );
  }

  createRecord(pregnancy_data: RecordCreateRequest) {
    return this._httpClient.post(environment.apiUrl + 'record', pregnancy_data).pipe(
      map((res: RecordResponse) => {
        return res;
      }),
    );
  }

  createImage(record_id: string): Observable<MediaResponse[]> {
    return this._httpClient.post<MediaResponse[]>(environment.apiUrl + 'multi_media?record_id=' + record_id, this.media);
  }

  updateRecord(pregnancy_data: RecordUpdateRequest) {
    return this._httpClient.patch<RecordResponse>(environment.apiUrl + 'record', pregnancy_data).pipe(
      map((res: RecordResponse) => {
        this.records.value.set(this.records.value().map((record) => (record.visit_record_id === res.visit_record_id ? res : record)));
        return res;
      }),
    );
  }

  updateImage(record_id: string): Observable<MediaResponse[]> {
    return this._httpClient.patch<MediaResponse[]>(environment.apiUrl + 'multi_media?record_id=' + record_id, this.media).pipe(
      map((res: MediaResponse[]) => {
        this.records.reload();
        return res;
      }),
    );
  }

  addImage(img: MediaResponse) {
    this.media.push(img);
  }

  SelectRecordData(record_id: string) {
    if (record_id === '') {
      this.selectedRecord = null;
      this.media = [];
    }
    const record = this.records.value().find((record) => record.visit_record_id === record_id);
    if (record) {
      this.selectedRecord = record;
      this.media = [];
      record.media.forEach((img) => {
        this._httpClient.get(environment.apiUrl + 'media/' + img.media_id, {}).subscribe((res: { media: MediaResponse; imgLink: string }) => {
          this.media.push({
            media_id: res.media.media_id,
            media_url: res.imgLink,
          });
        });
      });
    }
  }

  closeForm() {
    this.selectedRecord = null;
    this.media = [];
  }
}
