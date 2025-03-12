// membership-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { membershipDay, membershipResponse } from '@pregnancy-journal-monorepo/contract';
import { membershipService } from '../../core/membership/membership.service';
import { MembershipCardComponent } from '../membership-card/membership-card.component';

@Component({
  selector: 'app-membership-list',
  standalone: true,
  imports: [CommonModule, MembershipCardComponent, MatDialogModule],
  templateUrl: './buy-membership-dialog.component.html',
  styleUrls: ['buy-membership-dialog.component.css'],
})
export class MembershipListComponent {
  // Store the monthly price to calculate savings
  monthlyPrice: number = 0;
  protected memberships: membershipResponse[] = [];
  protected durationEnum = membershipDay;

  constructor(
    private membershipService: membershipService,
    private router: Router,
    private dialogRef: MatDialogRef<MembershipListComponent>,
  ) {
    this.membershipService.getMemberships().subscribe((data) => {
      this.memberships = data;

      // Find the monthly price for savings calculation
      const monthlyMembership = this.memberships.find((m) => m.duration_days === membershipDay.MONTHLY);
      if (monthlyMembership) {
        this.monthlyPrice = monthlyMembership.price;
      }
    });
  }

  getSavingsForYearly(membership: membershipResponse): number {
    if (membership.duration_days !== membershipDay.YEARLY || this.monthlyPrice === 0) {
      return 0;
    }

    return this.membershipService.getSavingsPercentage(this.monthlyPrice, membership.price);
  }

  onSelectMembership(id: string): void {
    this.dialogRef.close();
    this.router.navigate(['/membership', id]);
  }
}
