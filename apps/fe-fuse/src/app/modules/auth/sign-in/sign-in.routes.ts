import { Routes } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

export default [
  {
    path: '',
    loadComponent: () => AuthSignInComponent,
  },
] as Routes;
