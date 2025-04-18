import { Component, effect, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseHorizontalNavigationComponent, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
// import { SearchComponent } from 'app/layout/common/search/search.component';
// import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { NgOptimizedImage } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from 'app/layout/common/user/user.component';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { Subject, takeUntil } from 'rxjs';
import { MembershipListComponent } from '../../../../common/buy-membership-dialog/buy-membership-dialog.component';
import { membershipService } from '../../../../core/membership/membership.service';
import { ChildrenProfileSelectorComponent } from '../../../common/children-profile-selector/children-profile-selector.component';
import { HomeNoteComponent } from '../../../common/home-note/home-note.component';

@Component({
  selector: 'modern-layout',
  templateUrl: './modern.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    FuseHorizontalNavigationComponent,
    MatButtonModule,
    MatIconModule,
    LanguagesComponent,
    FuseFullscreenComponent,
    // SearchComponent,
    // ShortcutsComponent,
    // MessagesComponent,
    NotificationsComponent,
    UserComponent,
    RouterOutlet,
    HomeNoteComponent,
    NgAutoAnimateDirective,
    ChildrenProfileSelectorComponent,
    NgOptimizedImage,
  ],
})
export class ModernLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private dialog: MatDialog,
  ) {
    effect(() => {
      console.log(this.buy_membership());
      if (this.buy_membership() == true) {
        this.openMembershipDialog();
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
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

  buy_membership = inject(membershipService).buy_membership;

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

  openMembershipDialog(): void {
    const dialogRef = this.dialog.open(MembershipListComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.buy_membership.set(false);
    });
  }
}
