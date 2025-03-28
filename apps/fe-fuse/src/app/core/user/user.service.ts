import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _httpClient = inject(HttpClient);
  private _user: ReplaySubject<any> = new ReplaySubject<any>(1);
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current signed-in user data
   */
  // get(): Observable<User> {
  //   return this._httpClient.get<User>('api/common/user').pipe(
  //     tap((user) => {
  //       this._user.next(user);
  //     }),
  //   );
  // }

  /**
   * Update the user
   *
   * @param user
   */
  update(user: any): Observable<any> {
    return this._httpClient.patch<User>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      }),
    );
  }

  checkMember() {
    return this._user.pipe(
      map((user: User) => {
        return user.has_membership == true;
      }),
    );
  }

  getMembershipOfUser() {
    return this._user.pipe(
      map((user: User) => {
        return {
          has_membership: user.has_membership,
          membership_buy_date: user.membership_buy_date,
          membership_expire_date: user.membership_expire_date,
        };
      }),
    );
  }
}
