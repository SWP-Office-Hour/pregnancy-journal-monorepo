import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../../../core/auth/auth-google.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'auth-sign-in-with-google',
  templateUrl: './sign-in-with-google.component.html',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSignInWithGoogleComponent {
  protected _profile: any;
  private _authGoogleService = inject(AuthGoogleService);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  constructor() {
    this._authGoogleService.getProfile().subscribe((profile) => {
      this._profile = profile;
      this.signInWithGoogle({ email: profile.email, sub: profile.sub });
    });
  }

  signInWithGoogle({ email, sub }: { email: string; sub: number }) {
    this._authService.signIn({ email, password: sub.toString() }).subscribe({
      next: () => {
        this._router.navigateByUrl('');
      },
      error: (error) => {
        this._authService
          .confirmationRequired({
            email,
            password: sub.toString(),
            confirm_password: sub.toString(),
            agreements: true,
          })
          .subscribe((url) => {
            this._router.navigateByUrl(url);
          });
      },
    });
  }
}
