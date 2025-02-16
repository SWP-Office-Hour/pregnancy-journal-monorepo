import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, resource, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { HealthMetric, Status } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-health-metric-table',
  templateUrl: './health-metric-table.component.html',
  styleUrl: './health-metric-table.component.css',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    NgTemplateOutlet,
  ],
})
export class HealthMetricTableComponent implements OnInit {
  isLoading: boolean = false;
  selectedMetric: HealthMetric | null = null;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  metricList = signal<Array<HealthMetric>>([]);
  metricResource = resource<HealthMetric[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'metrics', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  constructor() {}

  async ngOnInit() {
    console.log('metricResource');
    console.log(this.metricResource.value());
    console.log('metricList signal');
    console.log(this.metricList());
    console.log('update signal');
    console.log(this.metricResource.value());
    const data = this.metricResource.value();
    this.metricList.set(data!);
    console.log('metricList signal');
    console.log(this.metricList());
  }

  createMetric() {
    console.log('Create metric');
  }

  protected readonly Status = Status;

  toggleDetails(metricId: string): void {
    // If the metric is already selected...
    if (this.selectedMetric && this.selectedMetric.metric_id === metricId) {
      // Close the details
      this.closeDetails();
      return;
    }
  }

  closeDetails(): void {
    this.selectedMetric = null;
  }
}
