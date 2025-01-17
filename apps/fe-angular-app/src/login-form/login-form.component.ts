import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthGoogleService } from '../services/auth-google.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { TuiAppearance, TuiButton, TuiError, TuiIcon, TuiNotification, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiFieldErrorPipe, TuiPassword, TuiSegmented, TuiSwitch, TuiTooltip } from '@taiga-ui/kit';

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiNotification,
    TuiSegmented,
    TuiSwitch,
    TuiTextfield,
    TuiTitle,
    TuiTooltip,
    TuiPassword,
    NgOptimizedImage,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private authService = inject(AuthGoogleService);
  signInWithGoogle() {
    this.authService.login();
  }
}
