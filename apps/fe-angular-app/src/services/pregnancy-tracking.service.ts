import { Injectable } from '@angular/core';
import { metricRes, pregnancyResponse, pregnancyUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { hospitals, metrics, pregnancyData } from '../app/pregnancy-tracking/pregnancy-tracking.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  protected pregnancyData: pregnancyResponse = pregnancyData;
  protected metrics: metricRes = metrics;
  protected hospitals: string[] = hospitals;

  updateData(data: pregnancyUpdateRequest) {
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
