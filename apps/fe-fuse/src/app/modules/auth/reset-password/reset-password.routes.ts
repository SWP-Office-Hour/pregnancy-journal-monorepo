import { Routes } from '@angular/router';
import { AuthResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';

export default [
  {
    path: '',
    loadComponent: () => AuthResetPasswordComponent,
  },
] as Routes;
