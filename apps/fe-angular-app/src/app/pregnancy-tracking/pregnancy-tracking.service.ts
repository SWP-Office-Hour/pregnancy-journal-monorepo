import { Injectable } from '@angular/core';
import { MetricRes, pregnancyResponse, PregnancyUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { hospitals, metrics, pregnancyData } from './pregnancy-tracking.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  protected pregnancyData: pregnancyResponse = pregnancyData;
  protected metrics: MetricRes[] = metrics;
  protected hospitals: string[] = hospitals;

  updateData(data: PregnancyUpdateRequest) {
    console.log(data);
  }

  getPregnancyData() {
    return this.pregnancyData;
  }

  getMetricsForUsers() {
    return this.metrics;
  }

  getHospitalList() {
    return this.hospitals;
  }
}
