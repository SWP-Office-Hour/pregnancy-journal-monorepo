import { Component } from '@angular/core';
import { PregnancyTrackingFormComponent } from './pregnancy-tracking-form/pregnancy-tracking-form.component';
import { TrackingStepperComponent } from './pregnancy-tracking-stepper/tracking-stepper.component';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent, TrackingStepperComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {}
