import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MetricRes } from '@pregnancy-journal-monorepo/contract';
// import { environment } from 'app/../environments/environment';
import { Router } from '@angular/router';
import {
  hospitalsObservable,
  metricsObservable,
  pregnancyDataObservableByPage,
  pregnancyDatatype,
} from './pregnancy-tracking.mock-api';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingService {
  //
  private router = inject(Router);

  //
  currentPage = 0;
  public recordPagesLength = signal<number>(0);
  public recordSelecting = signal<pregnancyDatatype[]>([]);
  public recordSelected: WritableSignal<pregnancyDatatype | null> = signal(null);

  //
  protected metrics = signal<MetricRes[]>([]);
  protected hospitals = signal([]);

  //
  private readonly url = 'http://localhost:3000/';

  //
  private mediaSrc = signal<{ id: string; mediaUrl: string }[]>([]);

  constructor(private httpClient: HttpClient) {
    metricsObservable().subscribe((metrics) => {
      this.metrics.set(metrics);
    });
    hospitalsObservable().subscribe((hospitals) => {
      this.hospitals.set(hospitals);
    });
  }

  selectRecord(value: string) {
    this.recordSelected.set(this.recordSelecting().find((record) => record.id === value));
    this.router.navigate(['/pregnancy-tracking', this.recordSelected().id]);
  }

  changePage(pageIndex: number) {
    this.currentPage = pageIndex;
    this.getPregnancyDataByPage();
    this.router.navigate(['/pregnancy-tracking', this.recordSelected().id]);
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

  getPregnancyDataByPage() {
    return pregnancyDataObservableByPage(this.currentPage, 5).subscribe((res) => {
      this.recordPagesLength.set(res.length);
      this.recordSelecting.set(res.data);
      this.recordSelected.set(res.data[0]);
    });
  }

  getMetrics() {
    // return this.httpClient.get<MetricRes[]>(`${this.url}metrics`);
    return metricsObservable();
  }

  getHospitalList() {
    // return this.httpClient.get<Hospital[]>(`${this.url}hospitals`);
    return hospitalsObservable();
  }
}
