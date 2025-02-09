import { Injectable } from '@angular/core';
import { hospitalsObservable, metricsObservable, pregnancyGetRes } from '../mock-api/pages/pregnancy/pregnancy.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyRecordApiService {
  constructor() {}

  getMetrics() {
    return metricsObservable();
  }

  getHospitalList() {
    return hospitalsObservable();
  }

  submitPregnancyData(data: pregnancyGetRes) {
    console.log(data);
  }
}
