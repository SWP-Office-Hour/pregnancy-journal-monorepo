import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardType } from '@pregnancy-journal-monorepo/contract';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.html',
})
export class StatsWidget {
  @Input() dashboardResource: DashboardType;
}
