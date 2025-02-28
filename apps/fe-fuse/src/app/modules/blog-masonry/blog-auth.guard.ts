import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

export const blogAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  // Check the authentication status
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        // If the user is not authenticated...
        if (!authenticated) {
          const urlTree = router.parseUrl(state.url.split('/').slice(2).join('/'));
          return of(urlTree);
        }
        // Allow the access
        return of(true);
      }),
    );
};

export const blogNoAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  // Check the authentication status
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        // If the user is not authenticated...
        if (authenticated) {
          const url: string[] = state.url.split('/');
          url[0] = 'authenticated';
          const urlTree = router.parseUrl(url.join('/'));
          return of(urlTree);
        }
        // Allow the access
        return of(true);
      }),
    );
};
