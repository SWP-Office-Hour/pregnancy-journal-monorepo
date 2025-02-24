import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { District, Province, Ward } from '../auth/confirmation-required/confirmation-required.type';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  profileForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  protected provinces: Province[] = [];
  protected districts: District[] = [];
  protected wards: Ward[] = [];

  constructor(
    private fb: FormBuilder,
    private _httpClient: HttpClient,
  ) {
    this.profileForm = this.fb.group({
      avatar: [null],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      address: ['', Validators.required],
    });

    this._httpClient.get<Province[]>('https://provinces.open-api.vn/api/p').subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  async onProvinceSelected(province_code_input: MatSelectChange) {
    const province_code = province_code_input.value;
    this.wards = [];
    this.districts = [];
    this._httpClient.get<Province>(`https://provinces.open-api.vn/api/p/${province_code}?depth=2`).subscribe((province) => {
      this.districts = province.districts!;
    });
  }

  async onDistrictSelected(district_code_input: MatSelectChange) {
    const district_code = district_code_input.value;
    this.wards = [];
    this._httpClient.get<District>(`https://provinces.open-api.vn/api/d/${district_code}?depth=2`).subscribe((district) => {
      this.wards = district.wards!;
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({ avatar: file });
      const reader = new FileReader();
      reader.onload = () => (this.avatarPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }
}
