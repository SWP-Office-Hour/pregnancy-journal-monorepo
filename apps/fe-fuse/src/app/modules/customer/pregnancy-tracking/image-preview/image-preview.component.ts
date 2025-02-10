import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PregnancyTrackingSignalService } from '../../../../core/customer/tracking/pregnancy-tracking.signal.service';
import { DialogImgComponent } from '../dialog-img/dialog-img.component';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: { id: string; mediaUrl: string };
  protected open = false;
  private dialog = inject(MatDialog);
  private pregnancyTrackingService: PregnancyTrackingSignalService = inject(PregnancyTrackingSignalService);

  openDialog() {
    this.dialog.open(DialogImgComponent, {
      data: { imgObj: this.imgObj },
    });
  }
}
