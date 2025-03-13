import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '../../../../@fuse/components/alert';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FuseAlertComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  forgotPasswordForm: FormGroup;
  showAlert = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _httpClient: HttpClient,
  ) {
    // Create the form
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Send reset link
   */
  sendResetLink(): void {
    // Return if the form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Set submitting state
    this.isSubmitting.set(true);

    // Hide the alert
    this.showAlert.set(false);

    const { email } = this.forgotPasswordForm.value;

    // Send the reset link
    this._httpClient.post<{ message: string }>(`${environment.apiUrl}users/auth/forgot-password`, { email }).subscribe({
      next: () => {
        // Set the alert
        this.alert = {
          type: 'success',
          message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn',
        };

        // Show the alert
        this.showAlert.set(true);
        this.isSubmitting.set(false);

        // Reset the form
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        // Set the alert
        this.alert = {
          type: 'error',
          message: error.error.message || 'Email không tồn tại trong hệ thống',
        };

        // Show the alert
        this.showAlert.set(true);
        this.isSubmitting.set(false);
      },
    });
  }
}
