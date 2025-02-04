import { Injectable, signal } from '@angular/core';
import { Hospital, MetricRes, pregnancyResponse, PregnancyUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { hospitals, metrics, pregnancyData } from './pregnancy-tracking.mock-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  protected pregnancyData: pregnancyResponse = pregnancyData;
  protected metrics: MetricRes[] = metrics;
  protected hospitals: string[] = hospitals;
  private readonly url = environment.apiUrl;
  private mediaSrc = signal<{ id: string; mediaUrl: string }[]>([]);
  private currentPage = signal<number>(0);

  constructor(private httpClient: HttpClient) {}

  get CurrentPage() {
    return this.currentPage;
  }

  get MediaSrc() {
    return this.mediaSrc;
  }

  deleteImage(id: string) {
    this.mediaSrc.set(this.mediaSrc().filter((img) => img.id !== id));
  }

  addImage(img: { id: string; mediaUrl: string }) {
    this.mediaSrc().push(img);
  }

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
