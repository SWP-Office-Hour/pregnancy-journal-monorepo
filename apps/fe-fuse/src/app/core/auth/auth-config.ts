import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  redirectUri: window.location.origin + '/signed-in-redirect',

  clientId: environment.clientId,

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,
};
