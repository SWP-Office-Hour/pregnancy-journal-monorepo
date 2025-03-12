import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { membershipService } from '../../membership/membership.service';
import { UserService } from '../../user/user.service';

export const memberAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const _membershipService = inject(membershipService);
  return inject(UserService)
    .checkMember()
    .pipe(
      map((isMember) => {
        if (!isMember) {
          _membershipService.buy_membership.set(true);
          return false;
        }
        return true;
      }),
    );
};
