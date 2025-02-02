import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-tracking-stepper',
  imports: [CommonModule, TuiPagination],
  templateUrl: './tracking-stepper.component.html',
  styleUrl: './tracking-stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingStepperComponent {
  protected readonly nth_times = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  protected currentPage = 0;

  constructor() {
    this.currentPage = this.nth_times.length - 1;
  }

  goToPage(page: number): void {
    console.log('goToPage', page);
  }
}
