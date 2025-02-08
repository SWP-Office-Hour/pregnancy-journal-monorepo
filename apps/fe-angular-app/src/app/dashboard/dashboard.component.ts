import { CommonModule } from '@angular/common';

import { Component, inject, signal } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiItem, TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiTextfieldComponent, TuiTextfieldDirective, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiBreadcrumbs, TuiFade, TuiTab, TuiTabsVertical } from '@taiga-ui/kit';
import { TuiAsideComponent, TuiCardLarge, TuiForm, TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { AuthGoogleService } from '../services/auth-google.service';

const MODULES = [CommonModule];

@Component({
  selector: 'app-dashboard',
  imports: [
    TuiNavigation,
    MODULES,
    TuiTabsVertical,
    TuiTab,
    TuiButton,
    FormsModule,
    ReactiveFormsModule,
    TuiAppearance,
    TuiAsideComponent,
    TuiFade,
    TuiBadge,
    TuiBreadcrumbs,
    TuiItem,
    TuiRepeatTimes,
    TuiCardLarge,
    TuiForm,
    TuiHeader,
    TuiTitle,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private authService = inject(AuthGoogleService);
  protected expandedSignal = signal(false);
  private router = inject(Router);

  protected readonly breadcrumbs = ['Home', 'Angular', 'Repositories', 'Taiga UI'];

  profile = this.authService.profile;

  logOut() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  protected handleToggle(): void {
    this.expandedSignal.update((e) => !e);
  }
}
