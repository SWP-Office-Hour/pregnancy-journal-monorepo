import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { TuiAppearance, TuiButton, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiPassword } from '@taiga-ui/kit';
import { AuthGoogleService } from '../services/auth-google.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
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
  loginNormal() {
    // this.userService.login();
  }
}
