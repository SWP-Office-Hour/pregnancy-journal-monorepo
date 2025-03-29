import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-payment-landing',
  imports: [],
  templateUrl: './payment-landing.component.html',
  styleUrl: './payment-landing.component.css',
})
export class PaymentLandingComponent implements OnInit, OnDestroy {
  countdown: number = 3;
  countdownMapping: any = {
    '=1': '# second',
    other: '# seconds',
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _http: HttpClient,
  ) {
    this._activeRoute.queryParams.subscribe((params) => {
      if (params['orderCode'] && params['status'] == 'PAID') {
        this._http.patch(`${{ environment }}payments`, { payos_order_code: params['orderCode'] }).subscribe();
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._authService.signInUsingToken().subscribe(() => {
            this._router.navigate(['home']);
          });
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--),
      )
      .subscribe();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
