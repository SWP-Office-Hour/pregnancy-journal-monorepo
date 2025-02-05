import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking-paging',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './pregnancy-tracking-paging.component.html',
  styleUrl: './pregnancy-tracking-paging.component.css',
})
export class PregnancyTrackingPagingComponent {
  pregnancyService = inject(PregnancyTrackingService);
  pageIndex = this.pregnancyService.currentPage;

  changePage({ pageIndex }) {
    this.pregnancyService.changePage(pageIndex);
  }
}
