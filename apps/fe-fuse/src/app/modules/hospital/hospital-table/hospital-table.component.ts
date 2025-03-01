// noinspection ExceptionCaughtLocallyJS

import { NgIf } from '@angular/common';
import { Component, effect, OnInit, resource, ViewChild } from '@angular/core';
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
import { fuseAnimations } from '@fuse/animations';
import { Hospital } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hospital-table',
  templateUrl: './hospital-table.component.html',
  styleUrl: './hospital-table.component.css',
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
    ToastModule,
    InputTextModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    NgIf,
    ConfirmPopup,
    SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class HospitalTableComponent implements OnInit {
  // Component state
  isLoading = false;
  hospitalDialogToggle = false;
  isSubmittedForm = false;

  // Form
  hospitalForm!: FormGroup;
  hospital!: Hospital;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  hospitalResource = resource<Hospital[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}hospitals`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch hospitals: ${response.status}`);
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
      console.log('Hospitals loaded:', this.hospitalResource.value());
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
    this.hospitalForm.reset({
      hospital_id: '',
      name: '',
      city: '',
    });
    this.isSubmittedForm = false;
    this.hospitalDialogToggle = true;
  }

  hideDialog(): void {
    this.hospitalDialogToggle = false;
    this.isSubmittedForm = false;
    this.hospitalForm.reset();
  }

  saveHospital(event: Event): void {
    this.isSubmittedForm = true;
    if (this.hospitalForm.invalid) {
      this.hospitalForm.markAllAsTouched();
      return;
    }

    const _hospital: Hospital = this.hospitalForm.value;
    const isUpdate = !!_hospital.hospital_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the hospital?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveHospitalToServer(_hospital, method, actionType);
      },
    });
  }

  editHospital(hospitalToEdit: Hospital): void {
    this.hospitalForm.patchValue({
      hospital_id: hospitalToEdit.hospital_id,
      name: hospitalToEdit.name,
      city: hospitalToEdit.city,
    });

    this.hospital = { ...hospitalToEdit };
    this.hospitalDialogToggle = true;
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.hospitalForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.hospitalForm = this.formBuilder.group({
      hospital_id: [''],
      name: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  private async saveHospitalToServer(hospital: Hospital, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}hospitals`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hospital),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} hospital`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.hospitalDialogToggle = false;
      this.hospitalForm.reset();
      this.hospital = {} as Hospital;
      this.hospitalResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Hospital ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in HospitalTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
