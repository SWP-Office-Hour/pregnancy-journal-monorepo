import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { membershipDay, membershipResponse, PaymentCreateRequestType, PaymentUpdateRequestType } from '@pregnancy-journal-monorepo/contract';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

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

  async updatePayment(payment: PaymentUpdateRequestType) {
    console.log('gọi hàm update payment status');
    const response = await fetch(`${environment.apiUrl}payments`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._authService.accessToken}`,
      },
      body: JSON.stringify(payment),
    });
    console.log(response);
    return response.json();
  }

  public buy_membership = signal<boolean>(false);

  getMemberships(): Observable<membershipResponse[]> {
    return this._httpClient.get<membershipResponse[]>(`${environment.apiUrl}memberships`);
  }

  getMembershipById(id: string): Observable<membershipResponse | undefined> {
    return this._httpClient.get<membershipResponse>(`${environment.apiUrl}memberships/${id}`);
  }

  getDurationLabel(duration: membershipDay): string {
    const label = 'Custom';
    if (duration === membershipDay.MONTHLY) {
      return 'Monthly';
    }
    if (duration === membershipDay.YEARLY) {
      return 'Yearly';
    }
    return label;
  }

  getSavingsPercentage(monthlyPrice: number, yearlyPrice: number): number {
    const monthlyYearTotal = monthlyPrice * 12;
    const savings = ((monthlyYearTotal - yearlyPrice) / monthlyYearTotal) * 100;
    return Math.round(savings);
  }

  getBadgeClass(duration: membershipDay): string {
    if (duration === membershipDay.MONTHLY) {
      return 'TIÊU CHUẨN';
    }
    if (duration === membershipDay.YEARLY) {
      return 'TIẾT KIỆM';
    }
    return 'DÙNG THỬ';
  }
}
