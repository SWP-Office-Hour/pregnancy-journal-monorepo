import { Routes } from '@angular/router';
import { AuthForgotPasswordComponent } from 'app/modules/auth/forgot-password/forgot-password.component';

export default [
  {
    path: '',
    loadComponent: () => AuthForgotPasswordComponent,
  },
] as Routes;
