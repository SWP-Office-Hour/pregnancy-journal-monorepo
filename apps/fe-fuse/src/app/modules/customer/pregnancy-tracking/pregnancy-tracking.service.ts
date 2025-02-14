import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HospitalResponse, MediaResponse, MetricResponse, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  currentPage = 0;
  currentRecordIndex = 0;
  private _recordData: RecordResponse[];
  private _recordDataLength: number;
  private _media: MediaResponse[] = [];
  private _hospitals: HospitalResponse[];
  private _metrics: MetricResponse[];
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
          this._recordDataLength = res.total;
          this._recordData = res.data;
          this._selectedRecord = this._recordData[0];
          this._media = this._selectedRecord.media;
          return this._recordData;
        }),
      );
  }

  get RecordDataLength() {
    return this._recordDataLength;
  }

  get SelectedRecordData() {
    return this._selectedRecord;
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
      .get<MetricResponse[]>(environment.apiUrl + 'metrics', {
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

  getRecordDataById(id: string) {
    this._selectedRecord = this._recordData.find((record) => record.id === id);
    this._media = this._selectedRecord.media;
  }

  selectRecord(id: number) {
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['tracking/view', id]));
  }

  changePage(pageIndex: number) {
    // this.currentPage = pageIndex;
    // const currRecordIndex = pageIndex * 5;
    // this.selectRecord(currRecordIndex);
  }

  deleteImage(id: string) {
    // this._mediaSrcet(this._media.filter((img) => img.id !== id));
    this._media = this._media.filter((img) => img.id !== id);
  }

  addImage(img: MediaResponse) {
    this._media.push(img);
  }

  submit(pregnancy_data: any) {
    // const data = {
    //   id: this.().id,
    //   ...pregnancy_data,
    //   media: this._media,
    // };
    console.log(pregnancy_data);
  }
}
