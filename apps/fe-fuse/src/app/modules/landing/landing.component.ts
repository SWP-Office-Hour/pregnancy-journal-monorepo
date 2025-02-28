import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-landing',
  imports: [MatAnchor, MatIcon, RouterLink, ButtonModule],
  templateUrl: './landing.component.html',
  // styleUrl: './landing.component.scss',
})
export class LandingComponent {}
