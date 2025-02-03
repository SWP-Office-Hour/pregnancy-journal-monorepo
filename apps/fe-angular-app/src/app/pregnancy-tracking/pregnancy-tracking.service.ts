import { Injectable } from '@angular/core';
import { Hospital, MetricRes, pregnancyResponse, PregnancyUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { hospitals, metrics, pregnancyData } from './pregnancy-tracking.mock-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  private readonly url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  protected pregnancyData: pregnancyResponse = pregnancyData;
  protected metrics: MetricRes[] = metrics;
  protected hospitals: string[] = hospitals;

  updateData(data: PregnancyUpdateRequest) {
    console.log(data);
  }

  getPregnancyData() {
    return this.pregnancyData;
  }

  getMetrics() {
    return this.httpClient.get<MetricRes[]>(`${this.url}metrics`);
  }

  getHospitalList() {
    return this.httpClient.get<Hospital[]>(`${this.url}hospitals`);
  }
}
