import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    FuseAlertComponent,
  ],
})
export class AuthConfirmationRequiredComponent {
  @ViewChild('confirmationNgForm') confirmationNgForm: any;
  protected confirmationForm: FormGroup;
  protected provinces: Province[] = [];
  protected districts: District[] = [];
  protected wards: Ward[] = [];
  protected alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  protected showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
  ) {
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
    if (!this._authService.signUpData) {
      this._router.navigate(['sign-up']);
    } else {
      this.confirmationForm.get('email').setValue(this._authService.signUpData.email);
      this.confirmationForm.get('password').setValue(this._authService.signUpData.password);
      this.confirmationForm.get('confirm_password').setValue(this._authService.signUpData.confirm_password);
      this._httpClient.get<Province[]>('https://provinces.open-api.vn/api/p/?depth=1').subscribe((provinces) => {
        this.provinces = provinces;
      });
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Submit the confirmation form
   */
  signUp() {
    this._authService.signUp(this.confirmationForm.value).subscribe({
      next: () => {
        this._router.navigate(['']);
      },
      error: (error) => {
        // Re-enable the form
        this.confirmationForm.enable();

        // Reset the form
        this.confirmationNgForm.resetForm();

        // Set the alert
        this.alert = {
          type: 'error',
          message: error.message,
        };

        // Show the alert
        this.showAlert = true;
      },
    });
  }

  /**
   * Select province
   * */
  selectProvince(province_code_input: MatSelectChange) {
    const province_code = province_code_input.value;
    this.wards = [];
    this.districts = [];
    this._httpClient.get<Province>(`https://provinces.open-api.vn/api/p/${province_code}?depth=2`).subscribe((province) => {
      this.districts = province.districts;
    });
  }

  /**
   * Select district
   * */
  selectDistrict(district_code_input: MatSelectChange) {
    const district_code = district_code_input.value;
    this.wards = [];
    this._httpClient.get<District>(`https://provinces.open-api.vn/api/d/${district_code}?depth=2`).subscribe((district) => {
      this.wards = district.wards;
    });
  }
}
