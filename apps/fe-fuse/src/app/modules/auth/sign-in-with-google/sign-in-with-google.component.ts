import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'auth-sign-in-with-google',
  templateUrl: './sign-in-with-google.component.html',
  standalone: true,
  imports: [],
})
export class AuthSignInWithGoogleComponent {
  private _router = inject(Router);
  private _authService = inject(AuthService);

  constructor() {
    this._authService.signIn({ email: 'hughes.brian@company.com', password: 'admin' }).subscribe(() => {
      this._router.navigateByUrl('/signed-in-redirect');
    });
  }
}
