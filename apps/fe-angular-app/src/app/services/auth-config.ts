import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin + '/dashboard',

  clientId: process.env.MY_GOOGLE_CONSOLE_CLIENT_ID,

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,
};
