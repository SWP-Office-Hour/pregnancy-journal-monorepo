import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, resource } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

import { FuseAlertService } from '../../../../@fuse/components/alert';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
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
export class HealthMetricTableComponent {
  private _fuseAlertService = inject(FuseAlertService);
  private _fuseConfirmationService: FuseConfirmationService;
  protected readonly Status = Status;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedMetric: HealthMetric | null = null;
  selectedMetricForm: UntypedFormGroup;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  // metricList = signal<Array<HealthMetric>>([]);

  metricResource = resource<HealthMetric[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'metrics', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    // Create the selected product form
    this.selectedMetricForm = this._formBuilder.group({
      metric_id: [''],
      title: ['New metric'],
      measurement_unit: ['', [Validators.required]],
      status: 0,
      required: [false],
      upperbound_msg: [''],
      lowerbound_msg: [''],
    });
    effect(() => {
      console.log('metricResource');
      console.log(this.metricResource.value());
      // console.log('metricList');
      // console.log(this.metricList());
    });
  }

  toggleDetails(metricId: string): void {
    // If the metric is already selected...
    if (this.selectedMetric && this.selectedMetric.metric_id === metricId) {
      // Close the details
      this.closeDetails();
      return;
    }
    const resultOfFindInList: HealthMetric | undefined = this.metricResource.value()!.find((item) => item.metric_id === metricId);
    if (resultOfFindInList) {
      this.selectedMetric = resultOfFindInList;
    } else {
      return;
    }
    // Fill the form
    this.selectedMetricForm.patchValue(this.selectedMetric);
    console.log(this.selectedMetricForm.value);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  closeDetails(): void {
    this.selectedMetric = null;
  }

  createMetric() {
    console.log('Create metric');
    this.closeDetails();
    console.log(this.selectedMetric);

    // Get the product object
    const metric = this.selectedMetricForm.getRawValue();
    console.log('I JUST RUN createMetric AND this.selectedMetricForm.getRawValue(); is ');
    console.log(metric);
    console.log('stringify');
    console.log(JSON.stringify(metric));

    (async () => {
      const response = await fetch(environment.apiUrl + 'metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
      if (!response.ok) throw Error(`Could not fetch...`);

      const rsJson = await response.json();
      console.log('rsJson');
      console.log(rsJson);

      this.metricResource.reload();
      this.selectedMetric = rsJson;
      this.selectedMetricForm.patchValue(rsJson);
    })();
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  updateSelectedMetric(): void {
    // Get the metric object
    const metric = this.selectedMetricForm.getRawValue();
    console.log('I JUST RUN updateSelectedProduct AND this.selectedMetricForm.getRawValue(); is ');
    console.log(metric);
    console.log('stringify');
    console.log(JSON.stringify(metric));

    (async () => {
      const response = await fetch(environment.apiUrl + 'metrics', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
      if (!response.ok) throw Error(`Could not fetch...`);

      const rsJson = await response.json();
      console.log('rsJson');
      console.log(rsJson);

      this.metricResource.reload();
    })();

    //   // Show a success message
    this.showFlashMessage('success');
  }

  deleteSelectedProduct(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete product',
      message: 'Are you sure you want to remove this product? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = this.selectedMetricForm.getRawValue();

        // Delete the product on the server
        // this._inventoryService.deleteProduct(product.id).subscribe(() => {
        // Close the details
        this.closeDetails();
        // });
      }
    });
  }

  /**
   * Show flash message
   */
  showFlashMessage(type: 'success' | 'error'): void {
    // Show the message
    this.flashMessage = type;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }
}
