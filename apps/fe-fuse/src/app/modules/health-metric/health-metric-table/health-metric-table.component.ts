import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, resource, ViewChild } from '@angular/core';
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
import { HealthMetric, Status } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from '../../../../environments/environment';

interface Column {
  field: string;
  header: string;
  // customExportHeader?: string;
}

@Component({
  selector: 'app-health-metric-table',
  templateUrl: './health-metric-table.component.html',
  styleUrl: './health-metric-table.component.css',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    TableModule,
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
    ToolbarModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    NgIf,
  ],
  providers: [MessageService, ConfirmationService],
})
export class HealthMetricTableComponent {
  protected readonly Status = Status;
  metricDialog: boolean = false;
  submitted: boolean = false;
  metric!: HealthMetric | {};
  @ViewChild('dt') dt!: Table;
  cols!: Column[];
  selectedMetric: HealthMetric | null = null;
  statuses!: any[];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
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
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    // // Create the selected product form
    // this.selectedMetricForm = this._formBuilder.group({
    //   metric_id: [''],
    //   title: ['New metric'],
    //   measurement_unit: ['', [Validators.required]],
    //   status: 0,
    //   required: [false],
    //   upperbound_msg: [''],
    //   lowerbound_msg: [''],
    // });
    effect(() => {
      console.log('metricResource');
      console.log(this.metricResource.value());
      // console.log('metricList');
      // console.log(this.metricList());
    });

    this.statuses = [
      { label: 'ACTIVE', value: Status.ACTIVE },
      { label: 'INACTIVE', value: Status.INACTIVE },
    ];

    this.cols = [
      { field: 'title', header: 'Title' },
      { field: 'measurement_unit', header: 'Unit' },
      { field: 'status', header: 'Status' },
      { field: 'required', header: 'Required' },
      { field: 'upperbound_msg', header: 'upperbound_msg' },
      { field: 'lowerbound_msg', header: 'lowerbound_msg' },
    ];
  }

  saveProduct() {
    this.submitted = true;
    let _metric = this.metricResource.value()!;
    // if (this.product.name?.trim()) {
    //   if (this.product.id) {
    //     _metric[this.findIndexById(this.product.id)] = this.product;
    //     this.products.set([..._metric]);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Updated',
    //       life: 3000,
    //     });
    //   } else {
    //     this.product.id = this.createId();
    //     this.product.image = 'product-placeholder.svg';
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Created',
    //       life: 3000,
    //     });
    //     this.products.set([..._metric, this.product]);
    //   }
    //
    //   this.productDialog = false;
    //   this.product = {};
    // }
  }

  hideDialog() {
    this.metricDialog = false;
    this.submitted = false;
  }

  editProduct(metricInp: HealthMetric) {
    this.metric = { ...metricInp };
    this.metricDialog = true;
  }

  getSeverityBoolean(require: boolean) {
    switch (require) {
      case true:
        return 'success';
      case false:
        return 'warn';
      default:
        return 'info';
    }
  }

  getSeverity(status: Status) {
    switch (status) {
      case Status.ACTIVE:
        return 'success';
      case Status.INACTIVE:
        return 'warn';
      default:
        return 'info';
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.metric = {};
    this.submitted = false;
    this.metricDialog = true;
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedMetric = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  //================================================================//

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
