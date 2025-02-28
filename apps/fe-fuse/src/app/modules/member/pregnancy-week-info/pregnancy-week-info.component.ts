import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-pregnancy-week-info',
  imports: [TooltipModule],
  templateUrl: './pregnancy-week-info.component.html',
  styleUrl: './pregnancy-week-info.component.css',
})
export class PregnancyWeekInfoComponent {
  @Input() countWeek = 0;
}
