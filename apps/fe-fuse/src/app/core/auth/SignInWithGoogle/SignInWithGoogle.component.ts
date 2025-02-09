import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGoogleService } from '../auth-google.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in-with-google',
  imports: [CommonModule],
  templateUrl: './SignInWithGoogle.component.html',
  styleUrl: './SignInWithGoogle.component.css',
})
export class SignInWithGoogleComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  protected authSer = inject(AuthGoogleService);
  private _authService = inject(AuthService);

  constructor() {
    this._authService.signIn({ email: 'hughes.brian@company.com', password: 'admin' }).subscribe(() => {
      this._router.navigateByUrl('/signed-in-redirect');
    });
  }
}
