import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentCreateRequestType, PaymentUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class membershipService {
  isLoading = false;
  constructor(
    private _authService: AuthService,
    private _httpClient: HttpClient,
  ) {}

  async createPayment(data: PaymentCreateRequestType): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment`);
      }

      const result = await response.json();
      console.log('Server response:', result);
      window.location.href = result.payment_url;
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  updatePayment(payment: PaymentUpdateRequestType) {
    console.log('gọi hàm update payment status');
    return this._httpClient
      .patch<PaymentUpdateRequestType>(environment.apiUrl + 'payments', payment, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response) => {
          console.log(response);
          return response;
        }),
      );
  }
}
