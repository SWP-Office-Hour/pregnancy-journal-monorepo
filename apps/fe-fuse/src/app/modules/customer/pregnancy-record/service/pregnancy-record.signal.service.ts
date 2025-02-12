import { inject, Injectable, signal } from '@angular/core';
// import { environment } from 'app/../environments/environment';
import { mediaType } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyRecordApiService } from './pregnancy-record.api.service';

@Injectable({ providedIn: 'root' })
export class PregnancyRecordSignalService {
  private apiService = inject(PregnancyRecordApiService);
  //handling the media files
  private mediaSrc = signal<mediaType[]>([]);

  constructor() {}

  get MediaSrc() {
    return this.mediaSrc;
  }

  deleteImage(id: string) {
    this.mediaSrc.set(this.mediaSrc().filter((img) => img.id !== id));
  }

  addImage(img: mediaType) {
    this.mediaSrc().push(img);
  }

  submit(pregnancy_data: any) {
    const data = {
      ...pregnancy_data,
      media: this.mediaSrc(),
    };
    this.apiService.submitPregnancyData(data);
  }
}
