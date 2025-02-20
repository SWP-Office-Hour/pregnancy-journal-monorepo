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
      this._media = record.media;
    }
  }

  get Media() {
    return this._media;
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
  }

  addImage(img: MediaResponse) {
    this._media.push(img);
  }

  submit(pregnancy_data: RecordUpdateRequest) {
    /**
     * Update image ở đây
     */
    // Mốt update image ở đây nè
    // xài dataURItoBlob để convert base64 sang blob
    // xài getFormData để convert blob sang FormData
    // rồi gửi lên server
    /**
     * Update record ở đây
     * */
    return this._httpClient
      .patch(
        environment.apiUrl + 'record',
        {
          ...pregnancy_data,
        },
        {
          headers: {
            Authorization: `Bearer ${this._authService.accessToken}`,
          },
        },
      )
      .pipe(
        map((res: RecordResponse) => {
          const index = this._recordData.findIndex((record) => record.visit_record_id === res.visit_record_id);
          this._recordData[index] = res;
          return res;
        }),
      );
  }

  dataURItoBlob(dataURI: string): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    const byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  getFormData(blob: Blob) {
    const fd = new FormData(document.forms[0]);
    fd.append('file', blob);
    return fd;
  }
}
