import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { membershipService } from '../membership.service';

@Component({
  selector: 'dialog-membership',
  templateUrl: './dialog.component.html',
  imports: [MatButtonModule, MatDialogClose],
})
export class DialogComponent {
  private isLoading: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; membershipId: string },
    private membershipService: membershipService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(membershipId: string): void {
    // this.membershipService.createPayment(membershipId);
  }
}
