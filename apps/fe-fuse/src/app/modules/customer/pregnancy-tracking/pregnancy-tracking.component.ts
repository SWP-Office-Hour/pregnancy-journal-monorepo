import { Component, inject, Input, WritableSignal } from '@angular/core';
import { PregnancyTrackingApiService } from './service/pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from './service/pregnancy-tracking.signal.service';
import { TrackingFormComponent } from './tracking-form/tracking-form.component';
import { TrackingSelectComponent } from './tracking-select/tracking-select.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [TrackingSelectComponent, TrackingFormComponent],
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
