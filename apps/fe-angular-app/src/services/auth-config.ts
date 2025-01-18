import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin + '/dashboard',

  clientId:
    '616565294967-s4tirlkflct55vu4imbn8c3cli3c3lks.apps.googleusercontent.com',

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,
};
