import { Component, inject } from '@angular/core';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';
import { TrackingStepperComponent } from './pregnancy-tracking-stepper/tracking-stepper.component';
import { TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { PregnancyTrackingService } from './pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, TrackingStepperComponent, TuiHeader, TuiTitle],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {
  private readonly pregnancyTrackingService: PregnancyTrackingService = inject(PregnancyTrackingService);

  pageChange(page: number) {
    this.pregnancyTrackingService.CurrentPage.set(page);
  }
}
