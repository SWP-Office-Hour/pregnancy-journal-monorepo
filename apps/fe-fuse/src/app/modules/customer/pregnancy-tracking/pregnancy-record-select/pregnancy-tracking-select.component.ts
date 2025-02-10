import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { PregnancyTrackingSignalService } from '../../../../core/customer/tracking/pregnancy-tracking.signal.service';
import { PregnancyTrackingPagingComponent } from '../pregnancy-tracking-paging/pregnancy-tracking-paging.component';

@Component({
  selector: 'app-pregnancy-record-select',
  imports: [CommonModule, MatRadioModule, PregnancyTrackingPagingComponent],
  templateUrl: './pregnancy-tracking-select.component.html',
  styleUrl: './pregnancy-tracking-select.component.css',
  standalone: true,
})
export class PregnancyTrackingSelectComponent {
  protected signalService = inject(PregnancyTrackingSignalService);
  protected currentPageIndex = this.signalService.currentPage;
  $records = computed(() => this.signalService.PregnancyData().slice(this.signalService.currentPage * 5, this.signalService.currentPage * 5 + 5));
  $selectedRecord = this.signalService.PregnancyDataById;

  selectRecord({ value }: MatRadioChange) {
    this.signalService.selectRecord(value);
  }
}
