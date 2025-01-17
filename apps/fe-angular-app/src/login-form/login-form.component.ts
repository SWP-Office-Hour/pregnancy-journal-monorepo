import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipe,
  TuiSegmented,
  TuiSwitch,
  TuiTooltip,
  TuiPassword,
} from '@taiga-ui/npm i @taiga-ui/{cdk,core,kit,icons}';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { AuthGoogleService } from '../services/auth-google.service';

@Component({
  selector: 'formLogin',
  standalone: true,
  exportAs: 'FormLoginComponent',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
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
  ],
  templateUrl: './form-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginFormComponent {
  // protected readonly form = new FormGroup({
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required]),
  // });
  private authService = inject(AuthGoogleService);

  signInWithGoogle() {
    this.authService.login();
  }
}
