import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
// import { environment } from 'app/../environments/environment';
import { Router } from '@angular/router';
import { mediaType, pregnancyDatatype } from '../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyTrackingApiService } from './pregnancy-tracking.api.service';

@Injectable({ providedIn: 'root' })
export class PregnancyTrackingSignalService {
  // handling pagination
  currentPage = 0;
  private router = inject(Router);
  private apiService = inject(PregnancyTrackingApiService);
  //handling pregnancy data
  private $pregnancyData = signal<pregnancyDatatype[]>([]);

  private $currentDataByPage = computed(() =>
    this.$pregnancyData().slice(this.currentPage * 5, this.currentPage * 5 + 5),
  );
  private $pregnancyDataById = signal<pregnancyDatatype | null>(null);
  //handling the media files
  private mediaSrc = signal<mediaType[]>([]);

  constructor(private httpClient: HttpClient) {}

  get PregnancyData() {
    return this.$pregnancyData;
  }

  get PregnancyDataById() {
    return this.$pregnancyDataById;
  }

  get MediaSrc() {
    return this.mediaSrc;
  }

  selectRecord(id: number) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['tracking/view', id]));
  }

  changePage(pageIndex: number) {
    this.currentPage = pageIndex;
    const currRecordIndex = pageIndex * 5;
    this.selectRecord(currRecordIndex);
  }

  deleteImage(id: string) {
    this.mediaSrc.set(this.mediaSrc().filter((img) => img.id !== id));
  }

  addImage(img: mediaType) {
    this.mediaSrc().push(img);
  }

  submit(pregnancy_data: any) {
    const data = {
      id: this.$pregnancyDataById().id,
      ...pregnancy_data,
      media: this.mediaSrc(),
    };
    this.apiService.submitPregnancyData(data);
  }
}
