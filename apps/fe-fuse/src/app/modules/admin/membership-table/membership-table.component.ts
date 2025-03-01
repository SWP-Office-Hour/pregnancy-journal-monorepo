// noinspection ExceptionCaughtLocallyJS

import { DecimalPipe, NgIf, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi'; // Import Vietnamese locale
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
import { Membership, Status } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { fuseAnimations } from '../../../../@fuse/animations';
import { environment } from '../../../../environments/environment';

registerLocaleData(localeVi); // Add this near the top of your file, after import
@Component({
  selector: 'app-membership-table',
  templateUrl: './membership-table.component.html',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    TextareaModule,
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
    DecimalPipe,
    InputNumber,
  ],
  providers: [MessageService, ConfirmationService],
})
export class MembershipTableComponent implements OnInit {
  // Constants
  protected readonly Status = Status;

  // Component state
  isLoading = false;
  membershipDialogToggle = false;
  isSubmittedForm = false;

  // Form
  membershipForm!: FormGroup;
  membership!: Membership;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  membershipResource = resource<Membership[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}memberships`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch memberships: ${response.status}`);
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
      console.log('Memberships loaded:', this.membershipResource.value());
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
    this.membershipForm.reset({
      membership_id: '',
      title: '',
      description: '',
      price: 0,
      status: Status.INACTIVE,
    });
    this.isSubmittedForm = false;
    this.membershipDialogToggle = true;
  }

  hideDialog(): void {
    this.membershipDialogToggle = false;
    this.isSubmittedForm = false;
    this.membershipForm.reset();
  }

  saveMembership(event: Event): void {
    this.isSubmittedForm = true;
    if (this.membershipForm.invalid) {
      this.membershipForm.markAllAsTouched();
      return;
    }

    const _membership: Membership = this.membershipForm.value;
    const isUpdate = !!_membership.membership_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the membership?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveMembershipToServer(_membership, method, actionType);
      },
    });
  }

  editMembership(membershipToEdit: Membership): void {
    this.membershipForm.patchValue({
      membership_id: membershipToEdit.membership_id,
      title: membershipToEdit.title,
      description: membershipToEdit.description,
      price: membershipToEdit.price,
      status: membershipToEdit.status,
    });

    this.membership = { ...membershipToEdit };
    this.membershipDialogToggle = true;
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

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.membershipForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.membershipForm = this.formBuilder.group({
      membership_id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      status: [Status.INACTIVE, Validators.required],
    });
  }

  private async saveMembershipToServer(membership: Membership, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}memberships`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(membership),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} membership`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.membershipDialogToggle = false;
      this.membershipForm.reset();
      this.membership = {} as Membership;
      this.membershipResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Membership ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in MembershipTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
