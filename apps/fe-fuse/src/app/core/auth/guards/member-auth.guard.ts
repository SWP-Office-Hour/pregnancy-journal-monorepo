import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { membershipService } from '../../membership/membership.service';
import { UserService } from '../../user/user.service';

export const memberAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const _membershipService = inject(membershipService);
  return inject(UserService)
    .checkMember()
    .pipe(
      tap((isMember) => {
        if (!isMember) {
          _membershipService.buy_membership.set(true);
        }
        return true;
      }),
    );
};
