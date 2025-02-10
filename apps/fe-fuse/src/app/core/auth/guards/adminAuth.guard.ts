import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AdminAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const authService = inject(AuthService);
  // Check the authentication status
  return authService.check().pipe(
    switchMap((authenticated) => {
      // If the user is not authenticated...
      if (!authenticated) {
        // Redirect to the sign-in page with a redirectUrl param
        const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
        const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

        return of(urlTree);
      }

      // Allow the access
      return authService.checkAdmin().pipe(
        switchMap((isAdmin) => {
          if (!isAdmin) {
            const urlTree = router.parseUrl(`admin`);
            return of(urlTree);
          }
          return of(true);
        }),
      );
    }),
  );
};
