import { HttpClient } from '@angular/common/http';
import { Injectable, resource } from '@angular/core';
import {
  ChildType,
  HospitalResponse,
  MediaResponse,
  MetricResponseType,
  RecordCreateRequest,
  RecordResponse,
  RecordUpdateRequest,
  Standard,
} from '@pregnancy-journal-monorepo/contract';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
      console.log(res.data);
      return res.data;
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

  constructor(
    private _httpClient: HttpClient,
    private childService: ChildV2Service,
  ) {
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }

  getNewestRecord() {
    return this.records
      .value()
      .sort((a, b) => new Date(a.visit_doctor_date).getTimezoneOffset() - new Date(b.visit_doctor_date).getTimezoneOffset())[0];
  }

  getStandardValue({ week, metric_id }: { metric_id: string; week: number }) {
    return this._httpClient.get<Standard[]>(environment.apiUrl + 'standards/' + metric_id).pipe(
      map((res: Standard[]) => {
        return res.find((standard) => standard.metric_id === metric_id);
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
