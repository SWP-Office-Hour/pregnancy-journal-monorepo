import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fuseAnimations } from '../../../@fuse/animations';

@Component({
  selector: 'app-health-metric',
  templateUrl: './health-metric.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [RouterOutlet],
})
export class HealthMetricComponent {}
