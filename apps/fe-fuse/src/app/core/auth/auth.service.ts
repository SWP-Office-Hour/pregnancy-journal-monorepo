import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse, RegisterRequest, UserRole } from '@pregnancy-journal-monorepo/contract';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;
  private _httpClient = inject(HttpClient);
  private _userService = inject(UserService);
  private _signUpData: { email: string; password: string; confirm_password: string };

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get signUpData(): { email: string; password: string; confirm_password: string } {
    return this._signUpData;
  }

  /**
   * Setter & getter for sign up data
   */
  set signUpData(data: { email: string; password: string; confirm_password: string }) {
    this._signUpData = data;
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get refreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  /**
   * Setter & getter for refresh token
   */
  set refreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return throwError(() => new Error('Not implemented'));
    // return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return throwError(() => new Error('Not implemented'));
    // return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return this._httpClient.post(environment.apiUrl + 'users/auth/login', credentials).pipe(
      switchMap((response: AuthResponse) => {
        // Store the access token in the local storage
        this.accessToken = response.access_token;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      }),
    );
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Sign in using the token
    return this._httpClient
      .get(environment.apiUrl + 'users/auth/sign-in-with-token', {
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
        },
      })
      .pipe(
        catchError(() =>
          // Return false
          of(false),
        ),
        switchMap((response: AuthResponse) => {
          // Replace the access token with the new one if it's available on
          // the response object.
          //
          // This is an added optional step for better security. Once you sign
          // in using the token, you should generate a new one on the server
          // side and attach it to the response object. Then the following
          // piece of code can replace the token with the refreshed one.
          if (response.access_token) {
            this.accessToken = response.access_token;
          }

          // Set the authenticated flag to true
          this._authenticated = true;

          // Store the user on the user service
          this._userService.user = response.user;

          // Return true
          return of(true);
        }),
      );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Confirmation required
   *
   * @param signUpData
   * */
  confirmationRequired(signUpData: { email: string; password: string; confirm_password: string; agreements: boolean }): Observable<any> {
    if (signUpData.password != signUpData.confirm_password) {
      return throwError(() => new Error('Mật khẩu không khớp'));
    } else {
      this.signUpData = signUpData;
      return of('confirmation-required');
    }
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: RegisterRequest): Observable<any> {
    return this._httpClient.post(environment.apiUrl + 'users/auth/register', user).pipe(
      map((response: AuthResponse) => {
        this.accessToken = response.access_token;
        this._authenticated = true;
        this._userService.user = {
          user_id: response.user.id,
          name: response.user.name,
          role: response.user.role,
          status: 'active',
          avatar: '',
          email: user.email,
        };
        return response;
      }),
    );
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists, and it didn't expire, sign in using it
    return this.signInUsingToken();
  }

  checkAdmin(): Observable<boolean> {
    const role = AuthUtils.getUserRole(this.accessToken);
    if (role != null) {
      if (role == UserRole.ADMIN) {
        return of(true);
      } else {
        return of(false);
      }
    } else {
      return of(false);
    }
  }
}
