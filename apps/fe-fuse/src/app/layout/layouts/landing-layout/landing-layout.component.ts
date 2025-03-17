import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { FuseLoadingBarComponent } from '../../../../@fuse/components/loading-bar';
import { LanguagesComponent } from '../../common/languages/languages.component';

@Component({
  selector: 'landing-layout',
  templateUrl: './landing-layout.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule, FuseLoadingBarComponent, LanguagesComponent, NgAutoAnimateDirective],
})
export class LandingLayoutComponent implements OnInit, OnDestroy {
  /**
   * Track the mobile menu open state
   */
  mobileMenuOpen = signal<boolean>(false);

  /**
   * Track scroll position to change header appearance
   */
  scrollPosition = 0;

  /**
   * Navigation data
   */
  navigation: Navigation;

  /**
   * Track if screen is small
   */
  isScreenSmall: boolean;

  /**
   * Subject for unsubscribing
   */
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
  ) {}

  /**
   * Track scroll position
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollPosition = window.scrollY;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
      this.navigation = navigation;
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('md');
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  /**
   * Get current year for copyright
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
