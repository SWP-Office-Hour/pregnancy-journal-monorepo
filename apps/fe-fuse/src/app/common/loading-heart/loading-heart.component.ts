import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading-heart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './loading-heart.component.html',
  styleUrl: './loading-heart.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LoadingHeartComponent {}
