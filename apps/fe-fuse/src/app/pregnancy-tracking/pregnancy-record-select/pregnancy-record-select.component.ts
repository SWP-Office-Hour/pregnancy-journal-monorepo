import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { PregnancyTrackingPagingComponent } from '../pregnancy-tracking-paging/pregnancy-tracking-paging.component';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-record-select',
  imports: [CommonModule, MatRadioModule, PregnancyTrackingPagingComponent],
  templateUrl: './pregnancy-record-select.component.html',
  styleUrl: './pregnancy-record-select.component.css',
})
export class PregnancyRecordSelectComponent {
  protected pregnancyService = inject(PregnancyTrackingService);
  records = this.pregnancyService.recordSelecting;
  selectedRecord = this.pregnancyService.recordSelected;

  selectRecord({ value }: MatRadioChange) {
    this.pregnancyService.selectRecord(value);
  }
}
