import { Component, inject } from '@angular/core';
import { PregnancyRecordSelectComponent } from './pregnancy-record-select/pregnancy-record-select.component';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';
import { PregnancyTrackingService } from './pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, PregnancyRecordSelectComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {
  private readonly pregnancyTrackingService: PregnancyTrackingService = inject(PregnancyTrackingService);
  protected pregnancyData = this.pregnancyTrackingService.recordSelected;

  constructor() {
    this.pregnancyTrackingService.getPregnancyDataByPage();
  }
}
