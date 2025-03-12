import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { membershipService } from '../../../core/membership/membership.service';

@Component({
  selector: 'dialog-membership',
  templateUrl: './dialog.component.html',
  imports: [MatButtonModule, MatDialogClose],
})
export class DialogComponent {
  private isLoading: boolean;
  constructor(
    private _router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { membershipId: string },
    private membershipService: membershipService,
    private _authService: AuthService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(membershipId: string): void {
    this._router.navigate(['/membership', membershipId]);
    // this.membershipService.createPayment({ membership_id: membershipId });
  }
}
