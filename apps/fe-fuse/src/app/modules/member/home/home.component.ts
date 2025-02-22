import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { RecommendedBlogsComponent } from '../recommended-blogs/recommended-blogs.component';
//
// @Component({
//   selector: 'expansion-duedate',
//   templateUrl: 'expansion-overview-example.html',
//   imports: [MatExpansionModule],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ExpansionOverviewExample {
//   readonly panelOpenState = signal(false);
// }

@Component({
  selector: 'app-dialog-content-price',
  imports: [MatDialogModule, MatButtonModule, FuseCardComponent, MatIcon],
  templateUrl: './dialog-content-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentPriceComponent {
  // constructor(
  //   private scroller: ViewportScroller,
  //   private router: Router,
  // ) {}
  // ngOnInit() {
  //   this.router.navigate(['/home']);
  // }

  // //Scroll
  // goDown1() {
  //   this.scroller.scrollToAnchor('listCard');
  // }

  goDown2() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById('header')!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  //
  // goDown3() {
  //   this.router.navigate([], { fragment: 'targetBlue' });
  // }
}

@Component({
  selector: 'app-home',
  imports: [
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    RecommendedBlogsComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    NgClass,
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    FuseCardComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  //User
  // private user: User;

  // Form tính ngày dự sinh
  private expectedDate: Date = new Date();
  public formatDate: string;
  countDownForm = new FormGroup({
    lastMenstrualPeriod: new FormControl('', Validators.required),
    menstrualCycle: new FormControl('', Validators.required),
  });

  calculateExpectedDate() {
    const lastMenstrualPeriodString: string | null = this.countDownForm.get('lastMenstrualPeriod')!.value;
    const lastMenstrualPeriod: Date | null = lastMenstrualPeriodString ? new Date(lastMenstrualPeriodString) : null;
    const menstrualCycleString: string | null = this.countDownForm.get('menstrualCycle')!.value;
    const menstrualCycle: number | null = menstrualCycleString ? Number(menstrualCycleString) : null;

    if (lastMenstrualPeriod instanceof Date && typeof menstrualCycle === 'number') {
      // Ngày dự sinh tiêu chuẩn với chu kỳ 28 ngày (40 tuần = 280 ngày)
      let dueDate = new Date(lastMenstrualPeriod);
      dueDate.setDate(dueDate.getDate() + 280);

      // Điều chỉnh theo độ dài chu kỳ kinh nguyệt
      let adjustment = menstrualCycle - 28;
      dueDate.setDate(dueDate.getDate() + adjustment);

      this.expectedDate = dueDate;
      this.formatDate = this.expectedDate.toLocaleDateString('vi-VN');
    }
  }

  //tooltip for Hôm nay mẹ đi khám
  @Input() tooltip: string;
  readonly dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(DialogContentPriceComponent);
  }
  //end Tooltip

  chartWeightOfFetal: ApexOptions = {};
  // chartTaskDistribution: ApexOptions = {};
  // chartBudgetDistribution: ApexOptions = {};
  // chartWeeklyExpenses: ApexOptions = {};
  // chartMonthlyExpenses: ApexOptions = {};
  // chartYearlyExpenses: ApexOptions = {};
  data: any;
  // selectedProject: string = 'ACME Corp. Backend App';
  // private _unsubscribeAll: Subject<any> = new Subject<any>();

  //Get data of Standard Metric

  /**
   * Constructor
   */
  constructor(
    //Form tính ngày dự sinh
    private _formBuilder: UntypedFormBuilder,
    //Chart weight of fetal
    // private _projectService: ProjectService,
    private _router: Router,
  ) {}

  // /**
  //  * On init
  //  */
  ngOnInit(): void {
    // Get the data
    // this._projectService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
    // Store the data
    // this.data = data;
    // Prepare the chart data
    // this._prepareChartData();
    // });
    // Attach SVG fill fixer to all ApexCharts
    // window['Apex'] = {
    //   chart: {
    //     events: {
    //       // mounted: (chart: any, options?: any): void => {
    //       //   this._fixSvgFill(chart.el);
    //       // },
    //       // updated: (chart: any, options?: any): void => {
    //       //   this._fixSvgFill(chart.el);
    //       // },
    //     },
    //   },
    // };
  }

  /**
   * On destroy
   */
  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions
  //   this._unsubscribeAll.next(null);
  //   this._unsubscribeAll.complete();
  // }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  // trackByFn(index: number, item: any): any {
  //   return item.id || index;
  // }

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
  // private _prepareChartData(): void {
  //   // Github issues
  //   this.chartGithubIssues = {
  //     chart: {
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'line',
  //       toolbar: {
  //         show: false,
  //       },
  //       zoom: {
  //         enabled: false,
  //       },
  //     },
  //     colors: ['#64748B', '#94A3B8'],
  //     dataLabels: {
  //       enabled: true,
  //       enabledOnSeries: [0],
  //       background: {
  //         borderWidth: 0,
  //       },
  //     },
  //     grid: {
  //       borderColor: 'var(--fuse-border)',
  //     },
  //     labels: this.data.githubIssues.labels,
  //     legend: {
  //       show: false,
  //     },
  //     plotOptions: {
  //       bar: {
  //         columnWidth: '50%',
  //       },
  //     },
  //     series: this.data.githubIssues.series,
  //     states: {
  //       hover: {
  //         filter: {
  //           type: 'darken',
  //           // value: 0.75,
  //         },
  //       },
  //     },
  //     stroke: {
  //       width: [3, 0],
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         color: 'var(--fuse-border)',
  //       },
  //       labels: {
  //         style: {
  //           colors: 'var(--fuse-text-secondary)',
  //         },
  //       },
  //       tooltip: {
  //         enabled: false,
  //       },
  //     },
  //     yaxis: {
  //       labels: {
  //         offsetX: -16,
  //         style: {
  //           colors: 'var(--fuse-text-secondary)',
  //         },
  //       },
  //     },
  //   };

  // Task distribution
  //   this.chartTaskDistribution = {
  //     chart: {
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'polarArea',
  //       toolbar: {
  //         show: false,
  //       },
  //       zoom: {
  //         enabled: false,
  //       },
  //     },
  //     labels: this.data.taskDistribution.labels,
  //     legend: {
  //       position: 'bottom',
  //     },
  //     plotOptions: {
  //       polarArea: {
  //         spokes: {
  //           connectorColors: 'var(--fuse-border)',
  //         },
  //         rings: {
  //           strokeColor: 'var(--fuse-border)',
  //         },
  //       },
  //     },
  //     series: this.data.taskDistribution.series,
  //     states: {
  //       hover: {
  //         filter: {
  //           type: 'darken',
  //           // value: 0.75,
  //         },
  //       },
  //     },
  //     stroke: {
  //       width: 2,
  //     },
  //     theme: {
  //       monochrome: {
  //         enabled: true,
  //         color: '#93C5FD',
  //         shadeIntensity: 0.75,
  //         shadeTo: 'dark',
  //       },
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     yaxis: {
  //       labels: {
  //         style: {
  //           colors: 'var(--fuse-text-secondary)',
  //         },
  //       },
  //     },
  //   };
  //
  //   // Budget distribution
  //   this.chartBudgetDistribution = {
  //     chart: {
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'radar',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#818CF8'],
  //     dataLabels: {
  //       enabled: true,
  //       formatter: (val: number): string | number => `${val}%`,
  //       textAnchor: 'start',
  //       style: {
  //         fontSize: '13px',
  //         fontWeight: 500,
  //       },
  //       background: {
  //         borderWidth: 0,
  //         padding: 4,
  //       },
  //       offsetY: -15,
  //     },
  //     markers: {
  //       strokeColors: '#818CF8',
  //       strokeWidth: 4,
  //     },
  //     plotOptions: {
  //       radar: {
  //         polygons: {
  //           strokeColors: 'var(--fuse-border)',
  //           connectorColors: 'var(--fuse-border)',
  //         },
  //       },
  //     },
  //     series: this.data.budgetDistribution.series,
  //     stroke: {
  //       width: 2,
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //       y: {
  //         formatter: (val: number): string => `${val}%`,
  //       },
  //     },
  //     xaxis: {
  //       labels: {
  //         show: true,
  //         style: {
  //           fontSize: '12px',
  //           fontWeight: '500',
  //         },
  //       },
  //       categories: this.data.budgetDistribution.categories,
  //     },
  //     yaxis: {
  //       max: (max: number): number => parseInt((max + 10).toFixed(0), 10),
  //       tickAmount: 7,
  //     },
  //   };
  //
  //   // Weekly expenses
  //   this.chartWeeklyExpenses = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'line',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#22D3EE'],
  //     series: this.data.weeklyExpenses.series,
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data.weeklyExpenses.labels,
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => `$${val}`,
  //       },
  //     },
  //   };

  // Monthly expenses
  //   this.chartMonthlyExpenses = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'line',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#4ADE80'],
  //     series: this.data.monthlyExpenses.series,
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data.monthlyExpenses.labels,
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => `$${val}`,
  //       },
  //     },
  //   };

  // Yearly expenses
  //   this.chartYearlyExpenses = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'line',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#FB7185'],
  //     series: this.data.yearlyExpenses.series,
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data.yearlyExpenses.labels,
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => `$${val}`,
  //       },
  //     },
  //   };
  // }
}
