import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { mediaType } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { DialogImgComponent } from '../dialog-img/dialog-img.component';
import { PregnancyTrackingSignalService } from '../service/pregnancy-tracking.signal.service';

@Component({
  selector: 'image-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: mediaType;
  protected open = false;
  private dialog = inject(MatDialog);
  private pregnancyTrackingService: PregnancyTrackingSignalService = inject(PregnancyTrackingSignalService);

  openDialog() {
    this.dialog.open(DialogImgComponent, {
      data: { imgObj: this.imgObj },
    });
  }
}
