import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin + '/sign-in-with-google',

  clientId: '616565294967-v2e8j0mi27a6ppbpt00mj7ge2dc2ninj.apps.googleusercontent.com',

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,
};
