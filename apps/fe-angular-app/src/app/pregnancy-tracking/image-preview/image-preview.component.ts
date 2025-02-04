import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAppearance, TuiButton, TuiDialog } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-image-preview',
  imports: [CommonModule, TuiAppearance, TuiCardLarge, TuiDialog, TuiButton],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgObj!: { id: string; mediaUrl: string };

  protected open = false;
  private pregnancyTrackingService: PregnancyTrackingService = inject(PregnancyTrackingService);

  showImage() {
    this.open = true;
  }

  deleteImage() {
    if (this.imgObj.id) {
      this.pregnancyTrackingService.deleteImage(this.imgObj.id);
    }
    this.open = false;
  }
}
