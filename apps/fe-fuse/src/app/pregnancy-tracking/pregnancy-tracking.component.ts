import { Component, inject, Input, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { PregnancyRecordSelectComponent } from './pregnancy-record-select/pregnancy-record-select.component';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';
import { PregnancyTrackingApiService } from './pregnancy-tracking.api.service';
import { pregnancyDatatype } from './pregnancy-tracking.mock-api';
import { PregnancyTrackingSignalService } from './pregnancy-tracking.signal.service';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, PregnancyRecordSelectComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {
  protected pregnancyDataById$: Observable<pregnancyDatatype>;
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

  // private readonly router = inject(Router);
}
