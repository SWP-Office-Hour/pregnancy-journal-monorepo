import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, resource } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { Hospital, Status } from '@pregnancy-journal-monorepo/contract';
import { FuseAlertService } from '../../../../@fuse/components/alert';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hospital-table',
  templateUrl: './hospital-table.component.html',
  styleUrl: './hospital-table.component.css',
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
export class HospitalTableComponent {
  private _fuseAlertService = inject(FuseAlertService);
  private _fuseConfirmationService: FuseConfirmationService;
  protected readonly Status = Status;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedHospital: Hospital | null = null;
  selectedHospitalForm: UntypedFormGroup;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  // hospitalList = signal<Array<HealthMetric>>([]);

  hospitalResource = resource<Hospital[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'hospitals', {
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
    this.selectedHospitalForm = this._formBuilder.group({
      hospital_id: [''],
      name: ['New Hospital'],
      city: [''],
    });
    effect(() => {
      console.log('hospitalResource');
      console.log(this.hospitalResource.value());
      // console.log('hospitalList');
      // console.log(this.hospitalList());
    });
  }

  toggleDetails(hospitalId: string): void {
    // If the metric is already selected...
    if (this.selectedHospital && this.selectedHospital.hospital_id === hospitalId) {
      // Close the details
      this.closeDetails();
      return;
    }
    const resultOfFindInList: Hospital | undefined = this.hospitalResource.value()!.find((item) => item.hospital_id === hospitalId);
    if (resultOfFindInList) {
      this.selectedHospital = resultOfFindInList;
    } else {
      return;
    }
    // Fill the form
    this.selectedHospitalForm.patchValue(this.selectedHospital);
    console.log(this.selectedHospitalForm.value);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  closeDetails(): void {
    this.selectedHospital = null;
  }

  createMetric() {
    //   this.closeDetails();
    //   console.log(this.selectedHospital);
    //
    //   const rawDataFromForm = this.selectedMetricForm.getRawValue();
    //   console.log('I JUST RUN createMetric AND this.selectedMetricForm.getRawValue(); is ');
    //   console.log(rawDataFromForm);
    //   console.log('stringify');
    //   console.log(JSON.stringify(rawDataFromForm));
    //
    //   (async () => {
    //     const response = await fetch(environment.apiUrl + 'metrics', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(rawDataFromForm),
    //     });
    //     if (!response.ok) throw Error(`Could not fetch...`);
    //
    //     const rsJson = await response.json();
    //     console.log('rsJson');
    //     console.log(rsJson);
    //
    //     this.hospitalResource.reload();
    //     this.selectedHospital = rsJson;
    //     this.selectedProductForm.patchValue(newProduct);
    //   })();
    //   // Mark for check
    //   this._changeDetectorRef.markForCheck();
  }

  updateSelectedHospital(): void {
    //   // Get the metric object
    //   const metric = this.selectedHospitalForm.getRawValue();
    //   // console.log('I JUST RUN updateSelectedProduct AND this.selectedMetricForm.getRawValue(); is ');
    //   // console.log(metric);
    //   // console.log('stringify');
    //   // console.log(JSON.stringify(metric));
    //
    //   (async () => {
    //     const response = await fetch(environment.apiUrl + 'metrics', {
    //       method: 'PATCH',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(metric),
    //     });
    //     if (!response.ok) throw Error(`Could not fetch...`);
    //
    //     const rsJson = await response.json();
    //     console.log('rsJson');
    //     console.log(rsJson);
    //
    //     this.hospitalResource.reload();
    //   })();
    //
    //   //   // Show a success message
    //   this.showFlashMessage('success');
  }

  deleteSelectedProduct(): void {
    //   // Open the confirmation dialog
    //   const confirmation = this._fuseConfirmationService.open({
    //     title: 'Delete product',
    //     message: 'Are you sure you want to remove this product? This action cannot be undone!',
    //     actions: {
    //       confirm: {
    //         label: 'Delete',
    //       },
    //     },
    //   });
    //
    //   // Subscribe to the confirmation dialog closed action
    //   confirmation.afterClosed().subscribe((result) => {
    //     // If the confirm button pressed...
    //     if (result === 'confirmed') {
    //       // Get the product object
    //       const product = this.selectedHospitalForm.getRawValue();
    //
    //       // Delete the product on the server
    //       // this._inventoryService.deleteProduct(product.id).subscribe(() => {
    //       // Close the details
    //       this.closeDetails();
    //       // });
    //     }
    //   });
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
