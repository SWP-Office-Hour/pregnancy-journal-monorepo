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
import { HealthMetric } from '@pregnancy-journal-monorepo/contract';

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
  ],
})
export class HealthMetricTableComponent implements OnInit {
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;
  metricList = signal<Array<HealthMetric>>([]);
  metricResource = resource<HealthMetric[], {}>({
    loader: async ({ request, abortSignal }) => {
      const response = await fetch('http://localhost:3000/api/metrics', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  constructor() {
    // this.metricList.update(this.metricResource.value());
    // this.metricList = signal<Array<HealthMetric>>([]);
  }
  ngOnInit(): void {
    // const metricResource;
    // console.log('metricResource');
    // console.log(this.metricResource.value());
    // console.log('metricList');
    // console.log(this.metricList());
  }

  createMetric() {
    console.log('Create metric');
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
