import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fuseAnimations } from '../../../@fuse/animations';

@Component({
  selector: 'app-health-metric',
  templateUrl: './health-metric.component.html',
  animations: fuseAnimations,
  imports: [RouterOutlet],
})
export class HealthMetricComponent {}
