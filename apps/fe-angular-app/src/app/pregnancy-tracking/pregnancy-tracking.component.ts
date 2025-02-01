import { Component } from '@angular/core';
import { PregnancyTrackingFormComponent } from '../../pregnancy-tracking-form/pregnancy-tracking-form.component';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [PregnancyTrackingFormComponent],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {}
