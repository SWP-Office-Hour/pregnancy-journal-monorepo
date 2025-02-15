import { inject, Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { Subject } from 'rxjs';
import { authConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);

  private router = inject(Router);

  profile: Subject<any> = new Subject<any>();

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.next(this.oAuthService.getIdentityClaims());
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();

    this.oAuthService.logOut();

    this.profile.next(null);
  }

  getProfile() {
    return this.profile;
  }
}
