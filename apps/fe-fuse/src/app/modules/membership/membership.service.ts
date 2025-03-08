import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentCreateRequestType } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class membershipService {
  isLoading = false;
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
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

      // this.userDialogToggle = false;
      // this.userForm.reset();
      // this.user = {} as UserTypeFromContract;
      // this.userResource.reload();

      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Successful',
      //   detail: `User ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
      //   life: 4000,
      // });
    } catch (error) {
      // this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // private notifyError(error: any): void {
  //   console.error('Error in Membership Component:', error);
  //   this.messageService.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: error.message || 'An unexpected error occurred',
  //     life: 4000,
  //   });
  // }
}
