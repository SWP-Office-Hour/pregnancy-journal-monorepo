import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import {
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
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  private _recordData: WritableSignal<RecordResponse[]> = signal([]);
  private _media: MediaResponse[] = [];
  private _hospitals: HospitalResponse[];
  private _metrics: MetricResponseType[];
  private _selectedRecord: RecordResponse;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  get RecordData$() {
    return this._httpClient.get<{ total: number; data: RecordResponse[] }>(environment.apiUrl + 'record').pipe(
      map((res: { total: number; data: RecordResponse[] }) => {
        this._recordData.set(res.data);
        return this._recordData;
      }),
    );
  }

  get SelectedRecordData(): RecordResponse {
    return this._selectedRecord;
  }

  set SelectedRecordData(record_id: string) {
    if (record_id === '') {
      this._selectedRecord = null;
      this._media = [];
    }
    const record = this._recordData().find((record) => record.visit_record_id === record_id);
    if (record) {
      this._selectedRecord = record;
      this._media = [];
      record.media.forEach((img) => {
        this._httpClient.get(environment.apiUrl + 'media/' + img.media_id, {}).subscribe((res: { media: MediaResponse; imgLink: string }) => {
          this._media.push({
            media_id: res.media.media_id,
            media_url: res.imgLink,
          });
        });
      });
    }
  }

  get Media(): MediaResponse[] {
    return this._media;
  }

  set Media(media: MediaResponse[]) {
    this._media = media;
  }

  getHospitals() {
    return this._httpClient
      .get<HospitalResponse[]>(environment.apiUrl + 'hospitals', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((hospitals) => {
          this._hospitals = hospitals;
          return this._hospitals;
        }),
      );
  }

  getMetrics() {
    return this._httpClient
      .get<MetricResponseType[]>(environment.apiUrl + 'metrics', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((metrics) => {
          this._metrics = metrics;
          return this._metrics;
        }),
      );
  }

  getStandardValue({ week, metric_id }: { metric_id: string; week: number }) {
    return this._httpClient.get<Standard[]>(environment.apiUrl + 'standards/' + metric_id).pipe(
      map((res: Standard[]) => {
        return res.find((standard) => standard.metric_id === metric_id);
      }),
    );
  }

  deleteImage(id: string) {
    this._media = this._media.filter((img) => img.media_id !== id);
    return this._media;
  }

  addImage(img: MediaResponse) {
    this._media.push(img);
  }

  deleteRecord(record_id: string) {
    return this._httpClient.delete(environment.apiUrl + 'record/' + record_id).pipe(
      map((res) => {
        this._recordData.set(this._recordData().filter((record) => record.visit_record_id !== record_id));
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
    return this._httpClient.post<MediaResponse[]>(environment.apiUrl + 'multi_media?record_id=' + record_id, this._media);
  }

  updateRecord(pregnancy_data: RecordUpdateRequest) {
    return this._httpClient.patch<RecordResponse>(environment.apiUrl + 'record', pregnancy_data).pipe(
      map((res: RecordResponse) => {
        this._recordData.set(this._recordData().map((record) => (record.visit_record_id === res.visit_record_id ? res : record)));
        return res;
      }),
    );
  }

  updateImage(record_id: string): Observable<MediaResponse[]> {
    return this._httpClient.patch<MediaResponse[]>(environment.apiUrl + 'multi_media?record_id=' + record_id, this._media).pipe(
      map((res: MediaResponse[]) => {
        this.RecordData$.subscribe();
        return res;
      }),
    );
  }

  closeForm() {
    this.SelectedRecordData = '';
  }

  getRecordDataByMetricId(metric_id: string) {
    return this._recordData().map((record) => {
      const data = record.data.find((value) => value.metric_id === metric_id);
      return {
        week: record.week,
        value: data ? Number(data.value) : null,
      };
    });
  }
}
