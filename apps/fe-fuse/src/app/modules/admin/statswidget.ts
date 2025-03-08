import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule, MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './statswidget.html',
})
export class StatsWidget {}
