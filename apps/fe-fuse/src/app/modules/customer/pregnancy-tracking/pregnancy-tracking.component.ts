import { Component, inject, Input, WritableSignal } from '@angular/core';
import { PregnancyTrackingApiService } from '../../../core/customer/tracking/pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from '../../../core/customer/tracking/pregnancy-tracking.signal.service';
import { pregnancyGetRes } from '../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyTrackingSelectComponent } from './pregnancy-record-select/pregnancy-tracking-select.component';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, PregnancyTrackingSelectComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
})
export class PregnancyTrackingComponent {
  private readonly signalService = inject(PregnancyTrackingSignalService);
  protected $pregnancyDataById: WritableSignal<pregnancyGetRes> = this.signalService.PregnancyDataById;
  private readonly apiService = inject(PregnancyTrackingApiService);

  constructor() {
    this.apiService.getPregnancyData().subscribe((data) => {
      this.signalService.PregnancyData.set(data);
    });
  }

  @Input()
  set id(id: number) {
    if (id > this.signalService.PregnancyData().length || id < 0) {
      this.signalService.selectRecord(this.signalService.PregnancyData().length - 1);
    } else {
      this.signalService.PregnancyDataById.set(
        this.signalService.PregnancyData()[id] ? this.signalService.PregnancyData()[id] : this.signalService.PregnancyData()[length - 1],
      );
      this.signalService.MediaSrc.set(this.signalService.PregnancyDataById().media || []);
    }
  }
}
