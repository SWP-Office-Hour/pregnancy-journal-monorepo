// standard-table.component.ts
import { NgIf } from '@angular/common';
import { Component, effect, model, OnInit, resource, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HealthMetric, Standard } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { fuseAnimations } from '../../../../@fuse/animations';
import { FuseScrollbarDirective } from '../../../../@fuse/directives/scrollbar';
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
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
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
    Message,
    FuseScrollbarDirective,
  ],
  providers: [MessageService, ConfirmationService],
})
export class StandardTableComponent implements OnInit {
  currentMetric = model<HealthMetric>();

  // Component state
  isLoading = false;
  standardDialogToggle = false;
  isSubmittedForm = false;

  // New batch editing state
  batchMode = false;
  newStandards: Standard[] = [];
  clonedStandards: { [s: string]: Standard } = {};

  // Form
  standardForm!: FormGroup;
  standard!: Standard;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resources
  // currentMetric = signal<HealthMetric>({
  //   metric_id: '',
  //   required: false,
  //   upperbound_msg: '',
  //   lowerbound_msg: '',
  //   status: Status.INACTIVE,
  //   title: '',
  //   measurement_unit: '',
  // });

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

  // metricsResource = resource<HealthMetric[], {}>({
  //   loader: async ({ abortSignal }) => {
  //     this.isLoading = true;
  //     try {
  //       const response = await fetch(`${environment.apiUrl}metrics`, {
  //         signal: abortSignal,
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch metrics: ${response.status}`);
  //       }
  //       return await response.json();
  //     } catch (error) {
  //       this.notifyError(error);
  //       return [];
  //     } finally {
  //       this.isLoading = false;
  //     }
  //   },
  // });

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

  // New batch mode methods
  openBatchMode(): void {
    if (!this.currentMetric().metric_id) {
      return;
    }
    this.batchMode = true;
    this.newStandards = [this.createNewStandardRow()];
  }

  createNewStandardRow(): Standard {
    return {
      standard_id: this.generateTempId(),
      week: 0,
      lowerbound: 0,
      upperbound: 0,
      who_standard_value: null,
      metric_id: this.currentMetric().metric_id,
    };
  }

  generateTempId(): string {
    return 'temp_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
  }

  addRow(): void {
    this.newStandards.push(this.createNewStandardRow());
  }

  onRowEditInit(standard: Standard): void {
    this.clonedStandards[standard.standard_id] = { ...standard };
  }

  onRowEditSave(standard: Standard): void {
    delete this.clonedStandards[standard.standard_id];
  }

  onRowEditCancel(standard: Standard, index: number): void {
    this.newStandards[index] = this.clonedStandards[standard.standard_id];
    delete this.clonedStandards[standard.standard_id];
  }

  cancelBatchMode(): void {
    this.batchMode = false;
    this.newStandards = [];
    this.clonedStandards = {};
  }

  validateStandards(): boolean {
    for (const standard of this.newStandards) {
      if (standard.week < 0 || standard.week > 50) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Week must be between 0 and 50',
          life: 4000,
        });
        return false;
      }

      if (standard.lowerbound === null || standard.upperbound === null) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Lower bound and upper bound are required',
          life: 4000,
        });
        return false;
      }
    }
    return true;
  }

  saveBatchStandards(event: Event): void {
    if (!this.validateStandards()) {
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to create ${this.newStandards.length} standards?`,
      header: 'Confirm Batch Creation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveBatchToServer();
      },
    });
  }

  async saveBatchToServer(): Promise<void> {
    this.isLoading = true;
    const successCount = 0;
    const failCount = 0;

    try {
      // Create array of promises for all standard creations
      const promises = this.newStandards.map(async (standard) => {
        // Remove the temporary ID before sending to server
        const standardToSave = { ...standard };
        // delete standardToSave.standard_id;

        const response = await fetch(`${environment.apiUrl}standards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(standardToSave),
        });

        if (!response.ok) {
          throw new Error(`Failed to create standard for week ${standard.week}`);
        }

        return await response.json();
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      this.batchMode = false;
      this.newStandards = [];
      this.standardResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `${promises.length} standards created successfully`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  deleteNewStandard(index: number): void {
    this.newStandards.splice(index, 1);
    if (this.newStandards.length === 0) {
      this.addRow(); // Always keep at least one row
    }
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
