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
import { PayIncludeUserInfo, PayStatus, Status } from '@pregnancy-journal-monorepo/contract';
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
import { Tag, TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { fuseAnimations } from '../../../@fuse/animations';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

registerLocaleData(localeVi);

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
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
export class PaymentComponent implements OnInit {
  // Constants
  protected readonly Status = Status;

  // Component state
  isLoading = false;

  // Form
  tagForm!: FormGroup;
  tag!: Tag;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  paymentResource = resource<PayIncludeUserInfo[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}payments/user`, {
          headers: {
            Authorization: `Bearer ${this.authService.accessToken}`,
          },
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.status}`);
        }
        const rs: PayIncludeUserInfo[] = await response.json();
        for (const payment of rs) {
          // @ts-ignore
          payment.status = this.convertStatusToReadable(payment.status);
          // @ts-ignore
          payment.created_at = this.formatDate(payment.created_at) as string;
        }

        return rs;
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
    private messageService: MessageService,
    private authService: AuthService,
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
    // console.log('Event:', event);
    // console.log('value:', (event.target as HTMLInputElement).value);
    console.log('Table:', table.value);
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityStatus(status: Status): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case Status.ACTIVE:
        return 'success';
      case Status.INACTIVE:
        return 'warn';
      default:
        return 'info';
    }
  }

  convertStatusToReadable(status: PayStatus): string {
    // console.log('Status:', status);
    switch (status) {
      case PayStatus.SUCCESS:
        return 'SUCCESS';
      case PayStatus.FAILED:
        return 'FAILED';
    }
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'N/A';

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
