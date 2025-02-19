import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { HospitalResponse, MediaResponse, MetricResponseType, RecordCreateRequest, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyRecordService {
  private _mediaSrc: MediaResponse[] = [];
  private _hospitals: HospitalResponse[];
  private _metrics = signal<MetricResponseType[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getMediaSrc() {
    return this._mediaSrc;
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
          this._metrics.set(metrics);
          return this._metrics();
        }),
      );
  }

  getHospital() {
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

  postImage({}: { image: MediaResponse; record_id: string }) {
    return this._httpClient.post(environment.apiUrl + 'media', {
      image: this._mediaSrc,
    });
  }

  deleteImage(id: string) {
    this._mediaSrc.splice(
      this._mediaSrc.findIndex((img) => img.media_id === id),
      1,
    );
  }

  addImage(img: MediaResponse) {
    this._mediaSrc.push(img);
  }

  submit(record_data: RecordCreateRequest) {
    return this._httpClient
      .post(environment.apiUrl + 'record', record_data, {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
      })
      .pipe(
        map((record: RecordResponse) => {
          return record;
        }),
      );
  }
}
