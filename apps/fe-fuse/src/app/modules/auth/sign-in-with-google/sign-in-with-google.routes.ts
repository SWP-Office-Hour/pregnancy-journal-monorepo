import { Routes } from '@angular/router';
import { AuthSignInWithGoogleComponent } from './sign-in-with-google.component';

export default [
  {
    path: '',
    loadComponent: () => AuthSignInWithGoogleComponent,
  },
] as Routes;
