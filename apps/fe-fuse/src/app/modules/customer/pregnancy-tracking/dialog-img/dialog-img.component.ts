import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PregnancyTrackingSignalService } from '../../../../core/customer/tracking/pregnancy-tracking.signal.service';

@Component({
  selector: 'app-dialog-img',
  templateUrl: './dialog-img.component.html',
  styleUrl: './dialog-img.component.css',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogImgComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imgObj: { id: string; mediaUrl: string } }) {}
  private pregnancyTrackingService: PregnancyTrackingSignalService = inject(PregnancyTrackingSignalService);

  deleteImage() {
    if (this.data.imgObj.id) {
      this.pregnancyTrackingService.deleteImage(this.data.imgObj.id);
    }
  }
}
