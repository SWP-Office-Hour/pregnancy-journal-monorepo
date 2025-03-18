import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { LoadingHeartComponent } from '../../common/loading-heart/loading-heart.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, LoadingHeartComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {}
