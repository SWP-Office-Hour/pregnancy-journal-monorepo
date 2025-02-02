import { inject, Injectable, signal } from '@angular/core';

import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { authConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  profile = signal<any>(null);
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();

    this.oAuthService.logOut();

    this.profile.set(null);
  }

  getProfile() {
    return this.profile();
  }
}
