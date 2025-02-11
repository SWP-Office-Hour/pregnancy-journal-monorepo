import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PregnancyRecordSignalService } from '../../../../core/customer/record/pregnancy-record.signal.service';
import { mediaType } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { DialogImgComponent } from '../dialog-img/dialog-img.component';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: mediaType;
  protected open = false;
  private dialog = inject(MatDialog);
  private pregnancyTrackingService: PregnancyRecordSignalService = inject(PregnancyRecordSignalService);

  openDialog() {
    this.dialog.open(DialogImgComponent, {
      data: { imgObj: this.imgObj },
    });
  }
}
