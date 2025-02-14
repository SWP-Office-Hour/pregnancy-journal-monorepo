import { CommonModule } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MediaRes } from '@pregnancy-journal-monorepo/contract';
import { DialogImgComponent } from './dialog-img/dialog-img.component';

@Component({
  selector: 'image-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: MediaRes;
  protected open = false;
  private dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<DialogImgComponent>;
  deleteImg = output<string>();

  openDialog() {
    this.dialogRef = this.dialog.open(DialogImgComponent, {
      data: { imgObj: this.imgObj },
    });
    this.dialogRef.componentInstance.deleteImg.subscribe((id) => {
      if (id) {
        this.deleteImg.emit(id);
      }
      this.dialogRef.close();
    });
  }
}
