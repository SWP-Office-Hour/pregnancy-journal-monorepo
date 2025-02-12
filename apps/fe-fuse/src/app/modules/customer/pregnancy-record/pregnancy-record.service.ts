import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Hospital, MediaRes, MetricRes, RecordCreateRequest } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { mediaType } from '../../../mock-api/pages/pregnancy/pregnancy.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyRecordService {
  private _mediaSrc: MediaRes[] = [];
  private _hospitals: Hospital[];
  private _metrics = signal<MetricRes[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getMediaSrc() {
    return this._mediaSrc;
  }

  getMetrics() {
    return this._httpClient
      .get<MetricRes[]>(environment.apiUrl + 'metrics', {
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
      .get<Hospital[]>(environment.apiUrl + 'hospitals', {
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

  postImage({}: { image: MediaRes; record_id: string }) {
    return this._httpClient.post(environment.apiUrl + 'media', {
      image: this._mediaSrc,
    });
  }

  deleteImage(id: string) {
    this._mediaSrc.splice(
      this._mediaSrc.findIndex((img) => img.id === id),
      1,
    );
  }

  addImage(img: mediaType) {
    this._mediaSrc.push(img);
  }

  submit(record_data: RecordCreateRequest) {
    // this._httpClient
    //   .post(environment.apiUrl + 'record', record_data, {
    //     headers: {
    //       Authorization: `Bearer ${this._authService.accessToken}`,
    //     },
    //   })
    //   .pipe(map((record: RecordResponse) => record.id))
    //   .subscribe((id) => {
    //     this._mediaSrc.forEach((img) => {
    //       this.postImage({ image: img, record_id: id });
    //     });
    //   });
    console.log('record_data', record_data);
    console.log('images', this._mediaSrc);
  }
}
