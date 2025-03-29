import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { RegisterRequest } from '@pregnancy-journal-monorepo/contract';
import { FuseAlertComponent, FuseAlertType } from '../../../../@fuse/components/alert';
import { AuthService } from '../../../core/auth/auth.service';
import { District, Province, Ward } from './confirmation-required.type';

@Component({
  selector: 'auth-confirmation-required',
  templateUrl: './confirmation-required.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    FuseAlertComponent,
  ],
})
export class AuthConfirmationRequiredComponent implements OnInit {
  @ViewChild('confirmationNgForm') confirmationNgForm: any;

  // Step tracking
  protected step: number = 1;

  // Form groups for the three steps
  protected basicInfoForm: FormGroup;
  protected addressInfoForm: FormGroup;
  protected birthInfoForm: FormGroup;

  // Original form (keeping for compatibility)
  protected confirmationForm: FormGroup;

  // Location data
  protected provinces: Province[] = [];
  protected districts: District[] = [];
  protected wards: Ward[] = [];

  today: Date = new Date();
  maxDate: Date = new Date();
  minDate: Date = new Date();

  // Alerts
  protected alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  protected showAlert: boolean = false;

  protected birthInfoAlert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  protected showBirthInfoAlert: boolean = false;

  // Calculated due date
  protected calculatedDueDate: Date | null = null;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
  ) {
    // Initialize the original form for compatibility
    this.confirmationForm = this._formBuilder.group<RegisterRequest>({
      email: '',
      password: '',
      confirm_password: '',
      name: '',
      expected_birth_date: '',
      phone: '',
      province: '',
      ward: '',
      district: '',
      address: '',
    });

    this.maxDate.setMonth(this.today.getMonth() + 9);
    this.minDate.setMonth(this.today.getMonth() - 9);

    // Step 1: Basic Info Form
    this.basicInfoForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });

    // Step 2: Address Info Form
    this.addressInfoForm = this._formBuilder.group({
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    // Step 3: Birth Info Form
    this.birthInfoForm = this._formBuilder.group(
      {
        expected_birth_date: [null],
        last_period_date: [null],
      },
      { validator: this.atLeastOneRequired('expected_birth_date', 'last_period_date') },
    );

    // Check if sign-up data exists
    if (!this._authService.signUpData) {
      this._router.navigate(['sign-up']);
    } else {
      this.confirmationForm.get('email')!.setValue(this._authService.signUpData.email);
      this.confirmationForm.get('password')!.setValue(this._authService.signUpData.password);
      this.confirmationForm.get('confirm_password')!.setValue(this._authService.signUpData.confirm_password);

      // Load provinces for Step 2
      this._httpClient.get<Province[]>('https://provinces.open-api.vn/api/p/?depth=1').subscribe((provinces) => {
        this.provinces = provinces;
      });
    }
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  // Custom validator for birth info
  atLeastOneRequired(field1: string, field2: string) {
    return (group: FormGroup) => {
      const field1Value = group.get(field1)?.value;
      const field2Value = group.get(field2)?.value;
      return field1Value || field2Value ? null : { atLeastOneRequired: true };
    };
  }

  // Navigate to Step 2
  goToStep2(): void {
    if (this.basicInfoForm.valid) {
      this.confirmationForm.get('name')!.setValue(this.basicInfoForm.get('name')!.value);
      this.confirmationForm.get('phone')!.setValue(this.basicInfoForm.get('phone')!.value);
      this.step = 2;
      this.showAlert = false; // Reset alert
    } else {
      this.showAlert = true;
      this.alert = {
        type: 'error',
        message: 'Please fill in all required basic information fields.',
      };
    }
  }

  // Navigate to Step 3
  goToStep3(): void {
    if (this.addressInfoForm.valid) {
      this.confirmationForm.get('province')!.setValue(this.addressInfoForm.get('province')!.value);
      this.confirmationForm.get('district')!.setValue(this.addressInfoForm.get('district')!.value);
      this.confirmationForm.get('ward')!.setValue(this.addressInfoForm.get('ward')!.value);
      this.confirmationForm.get('address')!.setValue(this.addressInfoForm.get('address')!.value);
      this.step = 3;
      this.showAlert = false; // Reset alert
    } else {
      this.showAlert = true;
      this.alert = {
        type: 'error',
        message: 'Please fill in all required address fields.',
      };
    }
  }

  // Go back to Step 1
  goToStep1(): void {
    this.step = 1;
  }

  // Go back to Step 2 from Step 3
  goToStep2FromStep3(): void {
    this.step = 2;
  }

  // Calculate due date from last period
  calculateDueDate(): void {
    const lastPeriodDate = this.birthInfoForm.get('last_period_date')!.value;
    if (lastPeriodDate) {
      const dueDate = new Date(lastPeriodDate);
      dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
      this.calculatedDueDate = dueDate;
      this.birthInfoForm.get('expected_birth_date')!.setValue(dueDate);
    }
  }

  // Submit the form
  signUp(): void {
    if (this.birthInfoForm.get('last_period_date')!.value && !this.birthInfoForm.get('expected_birth_date')!.value) {
      this.calculateDueDate();
    }

    if (!this.birthInfoForm.valid) {
      this.showBirthInfoAlert = true;
      this.birthInfoAlert = {
        type: 'error',
        message: 'Please enter either the expected birth date or the last period date.',
      };
      return;
    }

    this.confirmationForm.get('expected_birth_date')!.setValue(this.birthInfoForm.get('expected_birth_date')!.value);

    // With this timezone-aware approach:
    const selectedDate = this.birthInfoForm.get('expected_birth_date')!.value;
    if (selectedDate) {
      // Preserve the local date by using date parts instead of direct ISO conversion
      const date = new Date(selectedDate);
      // Create ISO date string but force the time to noon to avoid timezone issues
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Create a new date with the time set to 12:00:00
      const adjustedDate = new Date(year, month, day, 12, 0, 0);
      this.confirmationForm.get('expected_birth_date')!.setValue(adjustedDate.toISOString());
    }

    this.confirmationForm.disable();
    this.basicInfoForm.disable();
    this.addressInfoForm.disable();
    this.birthInfoForm.disable();

    this._authService.signUp(this.confirmationForm.value).subscribe({
      next: () => this._router.navigate(['']),
      error: (error) => {
        this.confirmationForm.enable();
        this.basicInfoForm.enable();
        this.addressInfoForm.enable();
        this.birthInfoForm.enable();
        this.goToStep1();

        this.alert = { type: 'error', message: 'Email không hợp lệ hoặc đã có người sử dụng' };
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 2500);
      },
    });
  }

  // Province selection
  selectProvince(event: MatSelectChange): void {
    const provinceCode = event.value;
    this.wards = [];
    this.districts = [];
    this._httpClient.get<Province>(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).subscribe((province) => {
      this.districts = province.districts!;
    });
  }

  // District selection
  selectDistrict(event: MatSelectChange): void {
    const districtCode = event.value;
    this.wards = [];
    this._httpClient.get<District>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).subscribe((district) => {
      this.wards = district.wards!;
    });
  }

  // Setup listeners for birth info form
  private setupFormListeners(): void {
    this.birthInfoForm.get('expected_birth_date')?.valueChanges.subscribe((value) => {
      if (value) {
        const lastPeriodControl = this.birthInfoForm.get('last_period_date');
        if (lastPeriodControl?.value) {
          lastPeriodControl.setValue(null, { emitEvent: false });
        }
      }
    });

    this.birthInfoForm.get('last_period_date')?.valueChanges.subscribe((value) => {
      if (value) {
        const expectedBirthControl = this.birthInfoForm.get('expected_birth_date');
        if (expectedBirthControl?.value) {
          expectedBirthControl.setValue(null, { emitEvent: false });
        }
        this.calculateDueDate();
      }
    });
  }

  resetBirthDateSelection(): void {
    // Clear both form controls
    this.birthInfoForm.get('expected_birth_date').setValue(null);
    this.birthInfoForm.get('last_period_date').setValue(null);

    // Reset the calculated due date
    this.calculatedDueDate = null;

    // Make sure validation state is updated
    this.birthInfoForm.markAsUntouched();
    this.birthInfoForm.updateValueAndValidity();
  }
}
