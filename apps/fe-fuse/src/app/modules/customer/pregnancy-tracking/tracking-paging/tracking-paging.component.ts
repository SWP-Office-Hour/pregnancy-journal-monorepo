import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PregnancyTrackingSignalService } from '../service/pregnancy-tracking.signal.service';

@Component({
  selector: 'tracking-paging',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './tracking-paging.component.html',
  styleUrl: './tracking-paging.component.css',
  standalone: true,
})
export class TrackingPagingComponent {
  pregnancyService = inject(PregnancyTrackingSignalService);
  pageIndex = this.pregnancyService.currentPage;

  changePage({ pageIndex }) {
    this.pregnancyService.changePage(pageIndex);
  }
}
