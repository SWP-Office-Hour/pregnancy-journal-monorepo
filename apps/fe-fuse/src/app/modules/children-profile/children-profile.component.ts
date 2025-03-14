import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChildCreateRequestType, Gender } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

interface GenderOption {
  name: string;
  value: Gender;
}

@Component({
  selector: 'app-children-profile-insert',
  templateUrl: './children-profile.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, DatePickerModule, DropdownModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
})
export class ChildrenProfileComponent implements OnInit {
  profileForm: FormGroup;
  genders: GenderOption[];
  today: Date = new Date();
  maxDate: Date = new Date();
  Gender = Gender;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
  ) {
    // Set max date to 9 months from today
    this.maxDate.setMonth(this.today.getMonth() + 9);

    // Define gender options
    this.genders = [
      { name: 'Nam', value: Gender.MALE },
      { name: 'Nữ', value: Gender.FEMALE },
    ];
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      expected_birth_date: [null, [Validators.required]],
      gender: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Process the form data
      console.log(this.profileForm.value);
      const formData: ChildCreateRequestType = {
        name: this.profileForm.value.name,
        expected_birth_date: this.profileForm.value.expected_birth_date.toISOString().split('T')[0],
        gender: this.profileForm.value.gender,
      };
      console.log(formData);
      // this.http.post(environment.apiUrl + 'child', formData).subscribe({
      //   next: () => {
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Thành công',
      //       detail: 'Thông tin em bé đã được lưu',
      //     });
      //   },
      //   error: (error) => {
      //     // Show error message
      //     console.log(error);
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Lỗi',
      //       detail: 'Có lỗi xảy ra khi lưu thông tin em bé',
      //     });
      //   },
      // });
      // Reset form after successful submission
      this.profileForm.reset();
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });

      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại thông tin',
      });
    }
  }

  // Helper methods for validation
  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.errors?.['required']) {
      return 'Trường này không được để trống';
    }
    return '';
  }

  styleClass(field: string): string {
    const _class = 'w-full';

    if (this.isFieldInvalid(field)) {
      return `${_class} ng-invalid ng-dirty`;
    }
    return _class;
  }
}
