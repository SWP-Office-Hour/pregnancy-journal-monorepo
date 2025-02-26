import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UserProfileResponseType } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { environment } from '../../../environments/environment';
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
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  count = 0;
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
      expected_birth_date: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      address: ['', Validators.required],
    });

    fetch('https://provinces.open-api.vn/api/p')
      .then((response) => {
        return response.json();
      })
      .then((provinces: Province[]) => {
        this.provinces = provinces;
      });

    this._httpClient.get<UserProfileResponseType>(environment.apiUrl + 'users/profile').subscribe((profile) => {
      this.profileForm.patchValue({
        email: profile.email,
        name: profile.name,
        expected_birth_date: DateTime.fromISO(new Date(profile.expected_birth_date).toISOString()),
        phone: profile.phone,
        province: profile.province,
        district: profile.district,
        ward: profile.ward,
        address: profile.address,
      });

      console.log(profile);
    });
  }

  async onProvinceSelected(province_code_input: MatSelectChange) {
    const province_code = province_code_input.value;
    this.wards = [];
    this.districts = [];
    fetch(`https://provinces.open-api.vn/api/p/${province_code}?depth=2`)
      .then((response) => {
        return response.json();
      })
      .then((province: Province) => {
        this.districts = province.districts!;
      });
  }

  async onDistrictSelected(district_code_input: MatSelectChange) {
    const district_code = district_code_input.value;
    this.wards = [];
    fetch(`https://provinces.open-api.vn/api/d/${district_code}?depth=2`)
      .then((response) => {
        return response.json();
      })
      .then((district: District) => {
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
      const data = {
        ...this.profileForm.value,
        expected_birth_date: this.profileForm.value.expected_birth_date.toJSDate(),
      };
      console.log(data);
    }
  }

  expectedBirthDateChange(event: MatDatepickerInputEvent<any>) {
    const date_as_iso_string = (event.value as DateTime).plus({ hour: 7 }).toISO();
    this.profileForm.patchValue({ expected_birth_date: date_as_iso_string });
  }
}
