import { Component, inject, Input, WritableSignal } from '@angular/core';
import { pregnancyDatatype } from '../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyTrackingSelectComponent } from './pregnancy-record-select/pregnancy-tracking-select.component';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';
import { PregnancyTrackingApiService } from './pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from './pregnancy-tracking.signal.service';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, PregnancyTrackingSelectComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
})
export class PregnancyTrackingComponent {
  private readonly signalService = inject(PregnancyTrackingSignalService);
  protected $pregnancyDataById: WritableSignal<pregnancyDatatype> = this.signalService.PregnancyDataById;
  private readonly apiService = inject(PregnancyTrackingApiService);

  constructor() {
    this.apiService.getPregnancyData().subscribe((data) => {
      this.signalService.PregnancyData.set(data);
    });
  }

  @Input()
  set id(id: string) {
    this.signalService.PregnancyDataById.set(this.signalService.PregnancyData().find((data) => data.id === id));
    this.signalService.MediaSrc.set(this.signalService.PregnancyDataById().media || []);
  }
}
