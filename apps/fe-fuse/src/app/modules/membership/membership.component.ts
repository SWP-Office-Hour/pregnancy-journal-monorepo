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
  constructor(public dialog: MatDialog) {
    //dùng để coi giá trị của resource
    effect(() => {
      console.log('membershipResource');
      console.log(this.membershipResource.value());
    });
  }

  openDialog({ membershipTitle, membershipId }: { membershipTitle: string; membershipId: string }): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { title: membershipTitle, membershipId: membershipId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        // Handle the confirmation action here
      }
    });
  }
}
