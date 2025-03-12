import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { DashboardType } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from './admin.service';
import { ChartCombo } from './analysis/paymentAnalysis';
import { RevenueStreamWidget } from './analysis/revenuestreamwidget';
import { StatsWidget } from './statswidget';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    MatTooltipModule,
    MatTabsModule,
    StatsWidget,
    RevenueStreamWidget,
    CommonModule,
    ChartCombo,
  ],
})
export class AdminComponent implements OnInit, OnDestroy {
  selectedProject: string = 'ACME Corp. Backend App';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  data: DashboardType;
  /**
   * Constructor
   */
  constructor(
    private _projectService: AdminService,
    private _router: Router,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the data
    this._projectService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      // Store the data
      this.data = data;
      console.log(data);
    });

    // Attach SVG fill fixer to all ApexCharts
    // window['Apex'] = {
    //   chart: {
    //     events: {
    //       mounted: (chart: any, options?: any): void => {
    //         this._fixSvgFill(chart.el);
    //       },
    //       updated: (chart: any, options?: any): void => {
    //         this._fixSvgFill(chart.el);
    //       },
    //     },
    //   },
    // };
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
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Fix the SVG fill references. This fix must be applied to all ApexCharts
   * charts in order to fix 'black color on gradient fills on certain browsers'
   * issue caused by the '<base>' tag.
   *
   * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
   *
   * @param element
   * @private
   */
  // private _fixSvgFill(element: Element): void {
  //   // Current URL
  //   const currentURL = this._router.url;
  //
  //   // 1. Find all elements with 'fill' attribute within the element
  //   // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
  //   // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
  //   Array.from(element.querySelectorAll('*[fill]'))
  //     .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
  //     .forEach((el) => {
  //       const attrVal = el.getAttribute('fill');
  //       el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
  //     });
  // }

  /**
   * Prepare the chart data from the data
   *
   * @private
   */
}
