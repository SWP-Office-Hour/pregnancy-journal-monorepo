import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PregnancyRecordSignalService } from '../../../../core/customer/record/pregnancy-record.signal.service';

@Component({
  selector: 'app-dialog-img',
  templateUrl: './dialog-img.component.html',
  styleUrl: './dialog-img.component.css',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogImgComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imgObj: { id: string; mediaUrl: string } }) {}
  private pregnancyTrackingService: PregnancyRecordSignalService = inject(PregnancyRecordSignalService);

  deleteImage() {
    if (this.data.imgObj.id) {
      this.pregnancyTrackingService.deleteImage(this.data.imgObj.id);
    }
  }
}
