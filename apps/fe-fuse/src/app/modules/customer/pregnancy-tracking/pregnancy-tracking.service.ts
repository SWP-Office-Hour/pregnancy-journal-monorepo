import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HospitalResponse, MediaResponse, MetricResponseType, RecordResponse, RecordUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  private _recordData: RecordResponse[];
  private _media: MediaResponse[] = [];
  private _hospitals: HospitalResponse[];
  private _metrics: MetricResponseType[];
  private _selectedRecord: RecordResponse;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  get RecordData() {
    return this._httpClient
      .get<{ total: number; data: RecordResponse[] }>(environment.apiUrl + 'record', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((res: { total: number; data: RecordResponse[] }) => {
          this._recordData = res.data;
          return this._recordData;
        }),
      );
  }

  get SelectedRecordData(): RecordResponse {
    return this._selectedRecord;
  }

  set SelectedRecordData(record_id: string) {
    const record = this._recordData.find((record) => record.visit_record_id === record_id);
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

  deleteImage(id: string) {
    this._media = this._media.filter((img) => img.media_id !== id);
    return this._media;
  }

  addImage(img: MediaResponse) {
    this._media.push(img);
  }

  submit(pregnancy_data: RecordUpdateRequest) {
    /**
     * Update image ở đây
     */
    // Mốt update image ở đây nè
    /**
     * Update record ở đây
     * */
    return this._httpClient
      .patch(environment.apiUrl + 'record', pregnancy_data, {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((res: RecordResponse) => {
          const index = this._recordData.findIndex((record) => record.visit_record_id === res.visit_record_id);
          this._recordData[index] = res;
          return res;
        }),
      );
  }

  updateImage(record_id: string) {
    return this._httpClient
      .patch(environment.apiUrl + 'multi_media?record_id=' + record_id, this._media, {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((res: MediaResponse) => {
          this.RecordData.subscribe();
          return res;
        }),
      );
  }
}
