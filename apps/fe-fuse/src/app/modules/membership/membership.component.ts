import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, resource, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { Membership, Status } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { membershipService } from '../../core/membership/membership.service';
import { UserService } from '../../core/user/user.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'membership-user',
  templateUrl: './membership.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [MessageService],
  imports: [CarouselModule, MatButtonModule, MatIconModule, CardModule, ButtonModule, FuseCardComponent, FuseCardComponent, ToastModule, DecimalPipe],
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
      const data = await response.json();
      return data.filter((m: Membership) => m.status === Status.ACTIVE);
    },
  });

  /**
   * Constructor
   */
  constructor(
    public dialog: MatDialog,
    private membershipService: membershipService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    //dùng để coi giá trị của resource
    effect(() => {
      this.handleSuccessUrl();
    });
    this.authService.signInUsingToken().subscribe();
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

    if (status === 'PAID' && code === '00') {
      const res = this.membershipService.updatePayment({ payos_order_code: orderCode });
      res.then((response) => {
        console.log('Backend function called successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Membership', detail: 'Payment success', life: 3000 });
      });
    }

    if (status === 'CANCELLED' && code === '00') {
      this.messageService.add({ severity: 'error', summary: 'Membership', detail: 'Payment failed by Cancel', life: 3000 });
    }
  }
}
