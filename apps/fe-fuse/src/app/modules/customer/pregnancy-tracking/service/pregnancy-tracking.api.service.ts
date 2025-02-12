import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hospital, MetricRes, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/auth/auth.service';
import {
  pregnancyDataObservableUpdateFail,
  pregnancyDataObservableUpdateSuccess,
  pregnancyGetRes,
} from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingApiService {
  private env = environment;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getMetrics() {
    return this._httpClient.get<MetricRes[]>(this.env.apiUrl + 'metrics', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
    // return metricsObservable();
  }

  getHospitalList() {
    return this._httpClient.get<Hospital[]>(this.env.apiUrl + 'hospitals', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  getPregnancyData() {
    return this._httpClient.get<{ total: number; data: RecordResponse[] }>(this.env.apiUrl + 'record', {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  getPregnancyDataById(id: string) {
    return this._httpClient.get<{ total: number; data: RecordResponse[] }>(this.env.apiUrl + 'record/' + id, {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }

  submitPregnancyData(data: pregnancyGetRes) {
    return Math.random() > 0.5 ? pregnancyDataObservableUpdateSuccess(data) : pregnancyDataObservableUpdateFail(data);
  }
}
