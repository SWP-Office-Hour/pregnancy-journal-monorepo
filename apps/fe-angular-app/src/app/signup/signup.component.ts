import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthGoogleService } from '../services/auth-google.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { TuiAppearance, TuiButton, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiPassword, TuiTooltip } from '@taiga-ui/kit';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-signup.component',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiTextfield,
    TuiTitle,
    TuiPassword,
    NgOptimizedImage,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponentComponent {
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  protected readonly NgOptimizedImage = NgOptimizedImage;
  private authService = inject(AuthGoogleService);
  private userService: UsersService = inject(UsersService);

  signInWithGoogle() {
    this.authService.login();
  }
  signup() {
    // this.userService.login();
  }
}
