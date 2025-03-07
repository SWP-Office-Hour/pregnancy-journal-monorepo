import { I18nPluralPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'sign-out-fullscreen',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  imports: [RouterLink, I18nPluralPipe],
})
export class SignOutFullscreenComponent {
  countdown: number = 5;
  countdownMapping: any = {
    '=1': '# second',
    other: '# seconds',
  };

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}
}
