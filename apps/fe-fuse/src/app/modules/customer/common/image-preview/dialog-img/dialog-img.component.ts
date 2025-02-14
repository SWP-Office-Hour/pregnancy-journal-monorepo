import { Component, Inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';

@Component({
  selector: 'dialog-img',
  templateUrl: './dialog-img.component.html',
  styleUrl: './dialog-img.component.css',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogImgComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imgObj: MediaResponse }) {}

  deleteImg = output<string>();

  deleteImage() {
    this.deleteImg.emit(this.data.imgObj.id);
  }
}
