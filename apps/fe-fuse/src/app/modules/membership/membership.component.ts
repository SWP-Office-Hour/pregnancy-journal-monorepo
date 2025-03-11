import { ChangeDetectionStrategy, Component, effect, resource, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { Membership } from '@pregnancy-journal-monorepo/contract';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { environment } from '../../../environments/environment';
import { DialogComponent } from './dialog/dialog.component';
import { membershipService } from './membership.service';

@Component({
  selector: 'membership-user',
  templateUrl: './membership.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CarouselModule, MatButtonModule, MatIconModule, CardModule, ButtonModule, FuseCardComponent, FuseCardComponent],
})
export class MembershipComponent {
  yearlyBilling: boolean = true;
  protected memberships: Membership[] = [];

  membershipResource = resource<Membership[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'memberships', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  /**
   * Constructor
   */
  constructor(
    public dialog: MatDialog,
    private membershipService: membershipService,
  ) {
    //dùng để coi giá trị của resource
    effect(() => {
      console.log(this.membershipResource.value());
      this.handleSuccessUrl();
    });
  }

  openDialog(membershipId: string): void {
    console.log(membershipId);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { membershipId: membershipId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        // Handle the confirmation action here
      }
    });
  }
  handleSuccessUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const cancel = urlParams.get('cancel');
    const status = urlParams.get('status');
    const orderCode = urlParams.get('orderCode');

    console.log('code', code);
    console.log('status', status);
    console.log('orderCode', orderCode);

    if (status === 'PAID' && code === '00') {
      console.log('Payment success gọi hàm update payment status');
      this.membershipService.updatePayment({ payos_order_code: orderCode });
      // this.http.post('http://localhost:3000/api/payment/success', { code, id, cancel, status, orderCode }).subscribe(
      //   (response) => {
      //     console.log('Backend function called successfully', response);
      //   },
      //   (error) => {
      //     console.error('Error calling backend function', error);
      //   },
      // );
    }
  }
}
