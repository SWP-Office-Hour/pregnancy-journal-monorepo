import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChildCreateRequestType, ChildType, Gender } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { Card } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment.staging';
import { AuthService } from '../../../core/auth/auth.service';
interface GenderOption {
  name: string;
  value: Gender;
}

@Component({
  selector: 'app-children-profile-table',
  imports: [
    CommonModule,
    ButtonDirective,
    DropdownModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    DatePickerModule,
    ToastModule,
    Card,
    Calendar,
  ],
  standalone: true,
  providers: [MessageService],
  templateUrl: './children-profile-table.component.html',
  styleUrl: './children-profile-table.component.css',
})
export class ChildrenProfileTableComponent implements OnInit {
  profileForm: FormGroup;
  genders: GenderOption[];
  today: Date = new Date();
  maxDate: Date = new Date();
  Gender = Gender;
  isEditMode = false;
  childId?: string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ChildrenProfileTableComponent>,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { child?: ChildType },
  ) {
    // Set max date to 9 months from today
    this.maxDate.setMonth(this.today.getMonth() + 9);

    this.genders = [
      { name: 'Nam', value: Gender.MALE },
      { name: 'Nữ', value: Gender.FEMALE },
      { name: 'Chưa xác định', value: null },
    ];
  }

  ngOnInit(): void {
    this.initForm();

    // Check if we're editing an existing child
    if (this.data?.child) {
      this.isEditMode = true;
      this.childId = this.data.child.child_id;
      this.populateForm(this.data.child);
    }
  }

  populateForm(child: ChildType): void {
    this.profileForm.patchValue({
      name: child.name,
      expected_birth_date: new Date(child.expected_birth_date),
      gender: child.gender,
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      expected_birth_date: [null, [Validators.required]],
      gender: [null], // Remove required validator
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData: ChildCreateRequestType = {
        name: this.profileForm.value.name,
        expected_birth_date: this.profileForm.value.expected_birth_date.toISOString().split('T')[0],
        gender: this.profileForm.value.gender,
      };
      if (formData.gender === null) {
        formData.gender = undefined;
      }
      console.log(formData);
      if (this.isEditMode) {
        // Update existing child
        this.http.patch(`${environment.apiUrl}child/${this.childId}`, formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Thông tin em bé đã được cập nhật',
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Có lỗi xảy ra khi cập nhật thông tin em bé',
            });
          },
        });
      } else {
        // Create new child
        this.http
          .post(environment.apiUrl + 'child', formData, {
            headers: {
              Authorization: `Bearer ${this._authService.accessToken}`,
            },
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Thông tin em bé đã được lưu',
              });
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi lưu thông tin em bé',
              });
            },
          });
      }
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại thông tin',
      });
    }
  }

  // Add these methods to children-profile-table.component.ts
  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) {
      return 'Thông tin này là bắt buộc';
    }
    return 'Thông tin không hợp lệ';
  }

  styleClass(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.invalid && (control.dirty || control.touched)) {
      return 'ng-invalid ng-dirty';
    }
    return '';
  }

  selectGender(gender: Gender | null): void {
    this.profileForm.get('gender')?.setValue(gender);
  }
}
