// health-metric-table.component.ts
// noinspection ExceptionCaughtLocallyJS
import { NgClass, NgIf } from '@angular/common';
import { Component, effect, OnInit, resource, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { fuseAnimations } from '../../../../@fuse/animations';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { FuseScrollbarDirective } from '../../../../@fuse/directives/scrollbar';
import { environment } from '../../../../environments/environment';
import { StandardTableComponent } from '../standard-table/standard-table.component';

@Component({
  selector: 'app-health-metric-table',
  templateUrl: './health-metric-table.component.html',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    ConfirmPopupModule,
    TableModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatCheckboxModule,
    ToolbarModule,
    TableModule,
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
    StandardTableComponent,
    FuseScrollbarDirective,
    FuseCardComponent,
    NgClass,
  ],
  providers: [MessageService, ConfirmationService],
})
export class HealthMetricTableComponent implements OnInit {
  // Constants
  protected readonly Status = Status;

  // Component state
  isLoading = false;
  metricDialogToggle = false;
  isSubmittedForm = false;
  expandedRows = {};

  // Form
  metricForm!: FormGroup;
  metric!: HealthMetric;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  metricResource = resource<HealthMetric[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}metrics`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        this.notifyError(error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  });

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      console.log('Metrics loaded:', this.metricResource.value());
    });
  }

  /**
   * Lifecycle Methods
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Public Methods
   */
  openNew(): void {
    this.metricForm.reset({
      metric_id: '',
      title: '',
      measurement_unit: '',
      status: Status.INACTIVE,
      required: false,
      upperbound_msg: '',
      lowerbound_msg: '',
    });
    this.isSubmittedForm = false;
    this.metricDialogToggle = true;
  }

  hideDialog(): void {
    this.metricDialogToggle = false;
    this.isSubmittedForm = false;
    this.metricForm.reset();
  }

  saveMetric(event: Event): void {
    this.isSubmittedForm = true;
    if (this.metricForm.invalid) {
      this.metricForm.markAllAsTouched();
      return;
    }

    const _metric: HealthMetric = this.metricForm.value;
    const isUpdate = !!_metric.metric_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the metric?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveMetricToServer(_metric, method, actionType);
      },
    });
  }

  editProduct(metricToEdit: HealthMetric): void {
    this.metricForm.patchValue({
      metric_id: metricToEdit.metric_id,
      title: metricToEdit.title,
      measurement_unit: metricToEdit.measurement_unit,
      status: metricToEdit.status,
      required: metricToEdit.required,
      upperbound_msg: metricToEdit.upperbound_msg,
      lowerbound_msg: metricToEdit.lowerbound_msg,
    });

    this.metric = { ...metricToEdit };
    this.metricDialogToggle = true;
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityStatus(status: Status): string {
    switch (status) {
      case Status.ACTIVE:
        return 'success';
      case Status.INACTIVE:
        return 'warn';
      default:
        return 'info';
    }
  }

  convertStatusToReadable(status: Status): string {
    switch (status) {
      case Status.ACTIVE:
        return 'ACTIVE';
      case Status.INACTIVE:
        return 'INACTIVE';
      default:
        return 'UNKNOWN';
    }
  }

  getSeverityRequired(required: boolean): string {
    return required ? 'success' : 'warn';
  }

  convertRequireToReadable(required: boolean): string {
    return required ? 'REQUIRED' : 'OPTIONAL';
  }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.metricForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.metricForm = this.formBuilder.group({
      metric_id: [''],
      title: ['', Validators.required],
      measurement_unit: ['', Validators.required],
      status: [Status.INACTIVE, Validators.required],
      required: [false, Validators.required],
      upperbound_msg: ['', Validators.required],
      lowerbound_msg: ['', Validators.required],
    });
  }

  private async saveMetricToServer(metric: HealthMetric, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}metrics`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} metric`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.metricDialogToggle = false;
      this.metricForm.reset();
      this.metric = {} as HealthMetric;
      this.metricResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Metric ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in HealthMetricTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
