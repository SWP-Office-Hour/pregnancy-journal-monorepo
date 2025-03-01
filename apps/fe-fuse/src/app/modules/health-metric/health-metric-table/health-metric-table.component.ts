import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, resource, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
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
import { FuseLoadingService } from '../../../../@fuse/services/loading';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-health-metric-table',
  templateUrl: './health-metric-table.component.html',
  styleUrl: './health-metric-table.component.css',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    ConfirmPopupModule,
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
    ConfirmPopup,
  ],
  providers: [MessageService, ConfirmationService],
})
export class HealthMetricTableComponent implements OnInit {
  private _fuseLoadingService = inject(FuseLoadingService);
  private _formBuilder = inject(FormBuilder);
  
  protected readonly Status = Status;
  @ViewChild('dt') dt!: Table;
  metricDialog: boolean = false;
  submitted: boolean = false;
  metric: HealthMetric;
  statuses!: any[];

  selectedMetric: HealthMetric | null = null;
  isLoading: boolean = false;
  selectedMetricForm: UntypedFormGroup;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  
  // Reactive form for the metric dialog
  metricForm: FormGroup;

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
    private _changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      console.log('metricResource');
      console.log(this.metricResource.value());
    });
  }
  
  ngOnInit(): void {
    // Initialize the reactive form with validation rules
    this.initForm();
  }
  
  /**
   * Initialize the metric form with validation rules
   */
  private initForm(): void {
    this.metricForm = this._formBuilder.group({
      metric_id: [''],
      title: ['', Validators.required],
      measurement_unit: ['', Validators.required],
      status: [Status.INACTIVE, Validators.required],
      required: [false, Validators.required],
      upperbound_msg: ['', Validators.required],
      lowerbound_msg: ['', Validators.required]
    });
  }

  /**
   * Method
   */

  saveMetric(event: Event) {
    console.log('event');
    console.log(event);

    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.metricForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.metricForm.markAllAsTouched();
      return;
    }
    
    // Get form values
    const _metric: HealthMetric = this.metricForm.value;

    const messageAction = _metric.metric_id != '' ? 'update' : 'create new';
    console.log('messageAction');
    console.log(messageAction);

    const messageDetail = messageAction.charAt(0).toUpperCase() + messageAction.slice(1) + 'd';
    const method = _metric.metric_id != '' ? 'PATCH' : 'POST';
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${messageAction} the metric?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        (async () => {
          const response = await fetch(environment.apiUrl + 'metrics', {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(_metric),
          });
          if (!response.ok) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Metric ${messageDetail}`,
              life: 4000,
            });
            throw Error(`Could not fetch...`);
          }
          const rsJson = await response.json();
          console.log('rsJson');
          console.log(rsJson);

          this.metricDialog = false;
          // Reset form after successful save
          this.metricForm.reset();
          // For backward compatibility
          // @ts-ignore
          this.metric = {};
          this.metricResource.reload();

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Metric ${messageDetail}`,
            life: 4000,
          });
        })();
      },
    });
  }

  hideDialog() {
    this.metricDialog = false;
    this.submitted = false;
    this.metricForm.reset();
  }
  
  /**
   * Get form control for easy access in template
   */
  get f(): { [key: string]: AbstractControl } {
    return this.metricForm.controls;
  }

  editProduct(metricInp: HealthMetric) {
    console.log('editProduct');
    console.log(metricInp);
    
    // Set the form values from the metric being edited
    this.metricForm.patchValue({
      metric_id: metricInp.metric_id,
      title: metricInp.title,
      measurement_unit: metricInp.measurement_unit,
      status: metricInp.status,
      required: metricInp.required,
      upperbound_msg: metricInp.upperbound_msg,
      lowerbound_msg: metricInp.lowerbound_msg
    });
    
    // For backward compatibility
    this.metric = { ...metricInp };
    this.metricDialog = true;
  }

  getSeverityRequired(require: boolean) {
    switch (require) {
      case true:
        return 'success';
      case false:
        return 'warn';
      default:
        return 'info';
    }
  }

  convertRequireToReadable(require: boolean) {
    switch (require) {
      case true:
        return 'REQUIRED';
      case false:
        return 'OPTIONAL';
    }
  }

  getSeverityStatus(status: Status) {
    switch (status) {
      case Status.ACTIVE:
        return 'success';
      case Status.INACTIVE:
        return 'warn';
      default:
        return 'info';
    }
  }

  convertStatusToReadable(status: Status) {
    switch (status) {
      case Status.ACTIVE:
        return 'ACTIVE';
      case Status.INACTIVE:
        return 'INACTIVE';
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    // Reset form and set default values
    this.metricForm.reset({
      metric_id: '',
      title: '',
      measurement_unit: '',
      status: Status.INACTIVE,
      required: false,
      upperbound_msg: '',
      lowerbound_msg: ''
    });
    
    // For backward compatibility, also reset the template-driven form
    // @ts-ignore
    this.metric = {
      status: Status.INACTIVE,
    };
    
    this.submitted = false;
    this.metricDialog = true;
  }

  // exportCSV() {
  //   this.dt.exportCSV();
  // }

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
  }
}
