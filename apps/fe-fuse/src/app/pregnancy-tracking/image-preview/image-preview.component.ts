import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';
import { DialogImgComponent } from './dialog-img/dialog-img.component';

@Component({
  selector: 'app-image-preview',
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: { id: string; mediaUrl: string };

  private dialog = inject(MatDialog);

  protected open = false;
  private pregnancyTrackingService: PregnancyTrackingService = inject(PregnancyTrackingService);

  openDialog() {
    this.dialog.open(DialogImgComponent, {
      data: { imgObj: this.imgObj },
    });
  }
}
