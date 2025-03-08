// noinspection ExceptionCaughtLocallyJS

import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
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
import { PaymentType, Status, Tag } from '@pregnancy-journal-monorepo/contract';
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
import { fuseAnimations } from '../../../../@fuse/animations';
import { environment } from '../../../../environments/environment';

registerLocaleData(localeVi);

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
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
    ConfirmPopup,
    SelectModule,
    DecimalPipe,
  ],
  providers: [MessageService, ConfirmationService],
})
export class PaymentTableComponent implements OnInit {
  // Constants
  protected readonly Status = Status;

  // Component state
  isLoading = false;
  tagDialogToggle = false;
  isSubmittedForm = false;

  // Form
  tagForm!: FormGroup;
  tag!: Tag;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  paymentResource = resource<PaymentType[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}payments`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.status}`);
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
      console.log('Payments loaded:', this.paymentResource.value());
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

  getPaymentSeverityStatus(status: string): string {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'danger';
      default:
        return 'info';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.tagForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.tagForm = this.formBuilder.group({
      tag_id: [''],
      title: ['', Validators.required],
      status: [Status.INACTIVE, Validators.required],
    });
  }

  private async saveTagToServer(tag: Tag, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}tags`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} tag`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.tagDialogToggle = false;
      this.tagForm.reset();
      this.tag = {} as Tag;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Tag ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in PaymentTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
