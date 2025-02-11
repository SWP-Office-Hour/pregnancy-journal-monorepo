import { Component, inject, Input, WritableSignal } from '@angular/core';
import { PregnancyTrackingApiService } from '../../../core/customer/tracking/pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from '../../../core/customer/tracking/pregnancy-tracking.signal.service';
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
  protected index = -1;
  private readonly signalService = inject(PregnancyTrackingSignalService);
  protected $recordDataLength: WritableSignal<number> = this.signalService.RecordDataLength;
  private readonly apiService = inject(PregnancyTrackingApiService);

  constructor() {
    this.apiService.getPregnancyData().subscribe((res) => {
      this.signalService.RecordData.set(res.data);
      this.signalService.RecordDataLength.set(res.total);
      const length = this.signalService.RecordDataLength();
      if (this.index >= length || this.index < 0) {
        this.signalService.selectRecord(0);
      }
      this.signalService.RecordDataById.set(res.data[this.index]);
    });
  }

  @Input()
  set id(id: number) {
    this.index = id;
  }

  protected readonly console = console;
}
