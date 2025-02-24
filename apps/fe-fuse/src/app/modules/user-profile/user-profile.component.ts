import { CommonModule } from '@angular/common';
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
  count = 0;
  profileForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  protected provinces: Province[] = [];
  protected districts: District[] = [];
  protected wards: Ward[] = [];

  constructor(private fb: FormBuilder) {
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

    fetch('https://provinces.open-api.vn/api/p')
      .then((response) => {
        return response.json();
      })
      .then((provinces: Province[]) => {
        this.provinces = provinces;
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
        birthDate: this.profileForm.value.birthDate.toISODate(),
      };
      console.log(data);
    }
  }
}
