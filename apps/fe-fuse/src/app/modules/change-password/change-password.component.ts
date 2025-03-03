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
  errorMessage = signal<string | null>(null);
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  changePasswordForm = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
  });

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
      this.errorMessage.set('Please fill in all required fields');
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
        this._userService.user = res.user;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.isLoading = false;
      },
    });
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
      confirmPassword.setErrors(null);
      return true;
    }
  }

  isFieldTouched(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return control ? control.touched : false;
  }
}
