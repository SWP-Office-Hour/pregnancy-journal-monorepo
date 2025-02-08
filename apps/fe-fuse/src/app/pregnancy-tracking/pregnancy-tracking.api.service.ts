import { Injectable } from '@angular/core';
import {
  hospitalsObservable,
  metricsObservable,
  pregnancyDataObservable,
  pregnancyDataObservableById,
  pregnancyDataObservableUpdateFail,
  pregnancyDataObservableUpdateSuccess,
  pregnancyGetRes,
} from '../mock-api/pages/pregnancy/pregnancy.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingApiService {
  constructor() {}

  getMetrics() {
    return metricsObservable();
  }

  getHospitalList() {
    return hospitalsObservable();
  }

  getPregnancyData() {
    return pregnancyDataObservable();
  }

  getPregnancyDataById(id: string) {
    return pregnancyDataObservableById(id);
  }

  submitPregnancyData(data: pregnancyGetRes) {
    return Math.random() > 0.5 ? pregnancyDataObservableUpdateSuccess(data) : pregnancyDataObservableUpdateFail(data);
  }
}
