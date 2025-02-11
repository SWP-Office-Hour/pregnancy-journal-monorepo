import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  hospitalsObservable,
  metricsObservable,
  pregnancyDataObservable,
  pregnancyDataObservableById,
  pregnancyDataObservableUpdateFail,
  pregnancyDataObservableUpdateSuccess,
  pregnancyGetRes,
} from '../../../mock-api/pages/pregnancy/pregnancy.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingApiService {
  constructor(private _httpClient: HttpClient) {}

  getMetrics() {
    return metricsObservable();
  }

  getHospitalList() {
    return hospitalsObservable();
  }

  getPregnancyData() {
    // return this._httpClient.get<{ total: number; data: RecordResponse }>('https://localhost:3000/record');
    return pregnancyDataObservable();
  }

  getPregnancyDataById(id: string) {
    return pregnancyDataObservableById(id);
  }

  submitPregnancyData(data: pregnancyGetRes) {
    return Math.random() > 0.5 ? pregnancyDataObservableUpdateSuccess(data) : pregnancyDataObservableUpdateFail(data);
  }
}
