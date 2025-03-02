// standard-table.component.ts
import { NgIf } from '@angular/common';
import { Component, effect, OnInit, resource, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { HealthMetric, Standard, Status } from '@pregnancy-journal-monorepo/contract';
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
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-standard-table',
  templateUrl: './standard-table.component.html',
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
export class StandardTableComponent implements OnInit {
  // Component state
  isLoading = false;
  standardDialogToggle = false;
  isSubmittedForm = false;
  // selectedMetricId = '';

  // Form
  standardForm!: FormGroup;
  standard!: Standard;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resources
  currentMetric = signal<HealthMetric>({
    metric_id: '',
    required: false,
    upperbound_msg: '',
    lowerbound_msg: '',
    status: Status.INACTIVE,
    title: '',
    measurement_unit: '',
  });
  standardResource = resource<Standard[], { metricId: string } | undefined>({
    request: () => {
      if (this.currentMetric().metric_id === '') {
        return undefined;
      }
      return { metricId: this.currentMetric().metric_id };
    },
    loader: async ({ request, abortSignal }) => {
      this.isLoading = true;
      try {
        console.log('Fetching standards for metric:', request!.metricId);
        const response = await fetch(`${environment.apiUrl}standards/${request!.metricId}`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch standards: ${response.status}`);
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

  metricsResource = resource<HealthMetric[], {}>({
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
      console.log('Standards loaded:', this.standardResource.value());
      console.log('current metric:', this.currentMetric());
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
    this.standardForm.reset({
      standard_id: '',
      week: 0,
      lowerbound: 0,
      upperbound: 0,
      who_standard_value: null,
      metric_id: this.currentMetric().metric_id,
    });
    this.isSubmittedForm = false;
    this.standardDialogToggle = true;
  }

  hideDialog(): void {
    this.standardDialogToggle = false;
    this.isSubmittedForm = false;
    this.standardForm.reset();
  }

  saveStandard(event: Event): void {
    this.isSubmittedForm = true;
    if (this.standardForm.invalid) {
      this.standardForm.markAllAsTouched();
      return;
    }

    const _standard: Standard = this.standardForm.value;
    const isUpdate = !!_standard.standard_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the standard?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveStandardToServer(_standard, method, actionType);
      },
    });
  }

  editStandard(standardToEdit: Standard): void {
    this.standardForm.patchValue({
      standard_id: standardToEdit.standard_id,
      week: standardToEdit.week,
      lowerbound: standardToEdit.lowerbound,
      upperbound: standardToEdit.upperbound,
      who_standard_value: standardToEdit.who_standard_value,
      metric_id: standardToEdit.metric_id,
    });

    this.standard = { ...standardToEdit };
    this.standardDialogToggle = true;
  }

  deleteStandard(standard: Standard, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this standard?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStandardFromServer(standard.standard_id);
      },
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // onMetricChange(metricId: string): void {
  //   this.selectedMetricId = metricId;
  //   this.standardResource.reload();
  //   // <!--      (onChange)="onMetricChange($event.value)"-->
  // }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.standardForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.standardForm = this.formBuilder.group({
      standard_id: [''],
      week: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      lowerbound: [0, Validators.required],
      upperbound: [0, Validators.required],
      who_standard_value: [null],
      metric_id: [this.currentMetric().metric_id, Validators.required],
    });
  }

  private async saveStandardToServer(standard: Standard, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}standards`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} standard`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.standardDialogToggle = false;
      this.standardForm.reset();
      this.standard = {} as Standard;
      this.standardResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Standard ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async deleteStandardFromServer(standardId: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}standards/${standardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete standard');
      }

      this.standardResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Standard deleted',
        life: 3000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in StandardTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
