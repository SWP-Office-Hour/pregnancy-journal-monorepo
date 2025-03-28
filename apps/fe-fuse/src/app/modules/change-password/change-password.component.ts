import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponse } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  isLoading = false;
  successMessage: string | null = null;
  new_password = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  changePasswordForm = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
  });
  getPasswordStrength = signal<number>(0);

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _userService: UserService,
    private router: Router,
  ) {}

  submit() {
    this.errorMessage.set(null);
    this.isLoading = true;
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.errorMessage.set('Vui lòng điền vào tất cả các trường bắt buộc');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    if (!this.passwordMatchValidator(this.changePasswordForm)) {
      this.isLoading = false;
      return;
    }

    this._http.post<AuthResponse>(environment.apiUrl + 'users/auth/change-password', this.changePasswordForm.value).subscribe({
      next: (res) => {
        this._authService.accessToken = res.access_token;
        const user = {
          ...res.user,
          membership_expire_date: res.user.membership_expire_date ?? undefined,
        };
        this._userService.user = user;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.isLoading = false;
      },
    });
  }

  inputChange() {
    const password = this.changePasswordForm.get('password');
    if (!password || !password.value) return; // Return 0 for no password

    const value = password.value;
    let score = 0;

    // Length checks
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (value.length >= 16) score += 1;

    // Character type checks
    if (value.match(/[a-z]/)) score += 1; // Lowercase
    if (value.match(/[A-Z]/)) score += 1; // Uppercase
    if (value.match(/[0-9]/)) score += 1; // Numbers
    if (value.match(/[^a-zA-Z0-9]/)) score += 1; // Special characters
    // Map the raw score to strength levels
    if (score >= 6) {
      this.getPasswordStrength.set(4);
      return;
    } // Very strong
    if (score >= 4) {
      this.getPasswordStrength.set(3);
      return;
    } // Strong
    if (score >= 3) {
      this.getPasswordStrength.set(2);
      return;
    } // Medium
    else this.getPasswordStrength.set(1);
    return; // Weak
  }

  isFieldInvalid(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('password');
    const confirmPassword = form.get('confirm_password');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return false;
    } else {
      if (confirmPassword) {
        confirmPassword.setErrors(null);
      }
      return true;
    }
  }

  isFieldTouched(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return control ? control.touched : false;
  }
}
