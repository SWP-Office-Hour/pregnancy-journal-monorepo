import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hospital, MetricRes, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import {
  pregnancyDataObservableUpdateFail,
  pregnancyDataObservableUpdateSuccess,
  pregnancyGetRes,
} from '../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingApiService {
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getMetrics() {
    return this._httpClient.get<MetricRes[]>('http://localhost:3000/metrics', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
    // return metricsObservable();
  }

  getHospitalList() {
    return this._httpClient.get<Hospital[]>('http://localhost:3000/hospitals', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  getPregnancyData() {
    return this._httpClient.get<{ total: number; data: RecordResponse[] }>('http://localhost:3000/record', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  getPregnancyDataById(id: string) {
    return this._httpClient.get<{ total: number; data: RecordResponse[] }>('http://localhost:3000/record/' + id, {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  submitPregnancyData(data: pregnancyGetRes) {
    return Math.random() > 0.5 ? pregnancyDataObservableUpdateSuccess(data) : pregnancyDataObservableUpdateFail(data);
  }
}
