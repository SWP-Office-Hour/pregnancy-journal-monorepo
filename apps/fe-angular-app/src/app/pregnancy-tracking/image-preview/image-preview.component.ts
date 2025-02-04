import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-image-preview',
  imports: [CommonModule, TuiAppearance, TuiCardLarge],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
})
export class ImagePreviewComponent {
  @Input() imgSrc!: string;
}
