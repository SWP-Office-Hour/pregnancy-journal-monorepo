import { Injectable } from '@angular/core';
import {
  hospitalsObservable,
  metricsObservable,
  pregnancyDataObservable,
  pregnancyDataObservableById,
  pregnancyDatatype,
} from './pregnancy-tracking.mock-api';

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

  submitPregnancyData(data: pregnancyDatatype) {
    console.log(data);
  }
}
