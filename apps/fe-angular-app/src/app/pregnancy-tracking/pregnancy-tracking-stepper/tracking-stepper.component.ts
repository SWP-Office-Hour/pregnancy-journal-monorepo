import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-tracking-stepper',
  imports: [CommonModule, TuiPagination],
  templateUrl: './tracking-stepper.component.html',
  styleUrl: './tracking-stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingStepperComponent {
  pageChange = output<number>();
  protected readonly nth_times = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  protected currentPage = 0;

  get Length() {
    return this.nth_times.length;
  }

  constructor() {
    this.currentPage = this.nth_times.length - 1;
  }

  goToPage(page: number): void {
    console.log('goToPage', page);
    this.pageChange.emit(page);
  }
}
