import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PregnancyTrackingSignalService } from '../../../../core/customer/tracking/pregnancy-tracking.signal.service';

@Component({
  selector: 'app-pregnancy-tracking-paging',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './pregnancy-tracking-paging.component.html',
  styleUrl: './pregnancy-tracking-paging.component.css',
  standalone: true,
})
export class PregnancyTrackingPagingComponent {
  pregnancyService = inject(PregnancyTrackingSignalService);
  pageIndex = this.pregnancyService.currentPage;

  changePage({ pageIndex }) {
    this.pregnancyService.changePage(pageIndex);
  }
}
