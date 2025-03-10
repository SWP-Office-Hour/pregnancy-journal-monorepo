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
import { UserRole, UserStatus, UserTypeFromContract } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
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
    CalendarModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class UserTableComponent implements OnInit {
  // Constants
  protected readonly UserRole = UserRole;
  protected readonly UserStatus = UserStatus;

  // Component state
  isLoading = false;
  userDialogToggle = false;
  isSubmittedForm = false;

  // Form
  userForm!: FormGroup;
  user!: UserTypeFromContract;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  userResource = resource<UserTypeFromContract[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}users`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
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
      console.log('Users loaded:', this.userResource.value());
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
    this.userForm.reset({
      user_id: '',
      name: '',
      email: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      address: '',
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE,
      expected_birth_date: new Date(),
      membershipId: '',
    });
    this.isSubmittedForm = false;
    this.userDialogToggle = true;
  }

  hideDialog(): void {
    this.userDialogToggle = false;
    this.isSubmittedForm = false;
    this.userForm.reset();
  }

  saveUser(event: Event): void {
    this.isSubmittedForm = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const _user: UserTypeFromContract = this.userForm.value;
    const isUpdate = !!_user.user_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the user?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveUserToServer(_user, method, actionType);
      },
    });
  }

  editUser(userToEdit: UserTypeFromContract): void {
    this.userForm.patchValue({
      user_id: userToEdit.user_id,
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      province: userToEdit.province,
      district: userToEdit.district,
      ward: userToEdit.ward,
      address: userToEdit.address,
      role: userToEdit.role,
      status: userToEdit.status,
      expected_birth_date: new Date(userToEdit.expected_birth_date),
      membershipId: userToEdit.membershipId,
    });

    this.user = { ...userToEdit };
    this.userDialogToggle = true;
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityStatus(status: UserStatus): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'success';
      case UserStatus.BANNED:
        return 'danger';
      default:
        return 'info';
    }
  }

  convertStatusToReadable(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'ACTIVE';
      case UserStatus.BANNED:
        return 'BANNED';
      default:
        return 'UNKNOWN';
    }
  }

  getSeverityRole(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'info';
      case UserRole.MEMBER:
        return 'success';
      default:
        return 'warning';
    }
  }

  convertRoleToReadable(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'ADMIN';
      case UserRole.MEMBER:
        return 'MEMBER';
      default:
        return 'UNKNOWN';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) {
      return 'N/A';
    }
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.userForm = this.formBuilder.group({
      user_id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      address: ['', Validators.required],
      role: [UserRole.MEMBER, Validators.required],
      status: [UserStatus.ACTIVE, Validators.required],
      expected_birth_date: [new Date(), Validators.required],
      membershipId: [''],
    });
  }

  private async saveUserToServer(user: UserTypeFromContract, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}users`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} user`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.userDialogToggle = false;
      this.userForm.reset();
      this.user = {} as UserTypeFromContract;
      this.userResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `User ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in UserTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
