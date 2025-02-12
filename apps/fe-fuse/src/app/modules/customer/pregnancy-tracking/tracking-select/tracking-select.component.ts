import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { PregnancyTrackingSignalService } from '../service/pregnancy-tracking.signal.service';
import { TrackingPagingComponent } from '../tracking-paging/tracking-paging.component';

@Component({
  selector: 'tracking-select',
  imports: [CommonModule, MatRadioModule, TrackingPagingComponent],
  templateUrl: './tracking-select.component.html',
  styleUrl: './tracking-select.component.css',
  standalone: true,
})
export class TrackingSelectComponent {
  protected signalService = inject(PregnancyTrackingSignalService);
  protected currentPageIndex = this.signalService.currentPage;
  $records = computed(() => this.signalService.RecordData().slice(this.signalService.currentPage * 5, this.signalService.currentPage * 5 + 5));
  $selectedRecord = this.signalService.RecordDataById;

  selectRecord({ value }: MatRadioChange) {
    this.signalService.selectRecord(value);
  }
}
