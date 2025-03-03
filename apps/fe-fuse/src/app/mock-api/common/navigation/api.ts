import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { adminNavigation, defaultNavigation, landingNavigation } from 'app/mock-api/common/navigation/navigation.data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
  private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
  private readonly _adminNavigation: FuseNavigationItem[] = adminNavigation;
  private readonly _landingNavigation: FuseNavigationItem[] = landingNavigation;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Navigation - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
      // // Fill compact navigation children using the default navigation
      // this._compactNavigation.forEach((compactNavItem) => {
      //   this._defaultNavigation.forEach((defaultNavItem) => {
      //     if (defaultNavItem.id === compactNavItem.id) {
      //       compactNavItem.children = cloneDeep(defaultNavItem.children);
      //     }
      //   });
      // });
      //
      // // Fill futuristic navigation children using the default navigation
      // this._futuristicNavigation.forEach((futuristicNavItem) => {
      //   this._defaultNavigation.forEach((defaultNavItem) => {
      //     if (defaultNavItem.id === futuristicNavItem.id) {
      //       futuristicNavItem.children = cloneDeep(defaultNavItem.children);
      //     }
      //   });
      // });
      //
      // // Fill horizontal navigation children using the default navigation
      // this._horizontalNavigation.forEach((horizontalNavItem) => {
      //   this._defaultNavigation.forEach((defaultNavItem) => {
      //     if (defaultNavItem.id === horizontalNavItem.id) {
      //       horizontalNavItem.children = cloneDeep(defaultNavItem.children);
      //     }
      //   });
      // });

      this._adminNavigation.forEach((adminNavItem) => {
        this._defaultNavigation.forEach((defaultNavItem) => {
          if (defaultNavItem.id === adminNavItem.id) {
            adminNavItem.children = cloneDeep(defaultNavItem.children);
          }
        });
      });

      // Return the response
      return [
        200,
        {
          default: cloneDeep(this._defaultNavigation),
          admin: cloneDeep(this._adminNavigation),
          // futuristic: cloneDeep(this._futuristicNavigation),
          // horizontal: cloneDeep(this._horizontalNavigation),
          // compact: cloneDeep(this._compactNavigation),
        },
      ];
    });

    this._fuseMockApiService.onGet('api/common/navigation/landing').reply(() => {
      return [
        200,
        {
          landing: cloneDeep(this._landingNavigation),
        },
      ];
    });
  }
}
