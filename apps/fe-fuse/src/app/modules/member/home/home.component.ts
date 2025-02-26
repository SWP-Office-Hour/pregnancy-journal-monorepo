import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TranslocoModule } from '@ngneat/transloco';
import { MetricResponseType, Status } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { PregnancyRecordService } from '../../customer/pregnancy-record/pregnancy-record.service';
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
export class HomeComponent {
  //Thai nhi
  //get data standard of metric from API
  protected metrics: MetricResponseType[];
  protected weightMetricId: string;
  protected readonly Status = Status;

  //1. Lấy User
  //2. Lấy ngày đẻ
  private _expectedDate: Date = new Date();
  //3. Tính tuần thai
  private _currentPregnancyWeek: number = 4;
  //Hàm tính tuần thai
  calculateCurrentPregnancyWeek() {
    // Chuyển đổi ngày dự sinh từ chuỗi sang Date
    const expectedDate = new Date(this._expectedDate);

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Tính số ngày còn lại đến ngày dự sinh
    const remainingDays = Math.floor((expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Tính số tuần thai hiện tại
    const currentPregnancyWeek = 40 - Math.floor(remainingDays / 7);

    // Kiểm tra nếu vượt quá 40 tuần
    if (currentPregnancyWeek < 0) {
      return; //'Đã quá ngày dự sinh!';
    } else if (currentPregnancyWeek > 40) {
      return; //'Lỗi: Ngày dự sinh không hợp lệ!';
    }
    this._currentPregnancyWeek = currentPregnancyWeek;
  }

  private _countWeek: number = this._currentPregnancyWeek;
  public get countWeek(): string {
    return this._countWeek.toString().padStart(4, '0');
  }
  standardResource = [
    { week: 8, weight: 1 },
    { week: 9, weight: 2 },
    { week: 10, weight: 4 },
    { week: 11, weight: 7 },
    { week: 12, weight: 14 },
    { week: 13, weight: 23 },
    { week: 14, weight: 43 },
    { week: 15, weight: 70 },
    { week: 16, weight: 100 },
    { week: 17, weight: 140 },
    { week: 18, weight: 190 },
    { week: 19, weight: 240 },
    { week: 20, weight: 300 },
    { week: 21, weight: 360 },
    { week: 22, weight: 430 },
    { week: 23, weight: 501 },
    { week: 24, weight: 600 },
    { week: 25, weight: 660 },
    { week: 26, weight: 760 },
    { week: 27, weight: 875 },
    { week: 28, weight: 1005 },
    { week: 29, weight: 1153 },
    { week: 30, weight: 1319 },
    { week: 31, weight: 1502 },
    { week: 32, weight: 1702 },
    { week: 33, weight: 1918 },
    { week: 34, weight: 2146 },
    { week: 35, weight: 2383 },
    { week: 36, weight: 2622 },
    { week: 37, weight: 2859 },
    { week: 38, weight: 3083 },
    { week: 39, weight: 3288 },
    { week: 40, weight: 3462 },
  ];
  //chưa có data bên database
  // standardResource = resource<Standard[], {}>({
  //   loader: async ({ abortSignal }) => {
  //     const response = await fetch(environment.apiUrl + 'standards/' + this.weightMetricId, {
  //       signal: abortSignal,
  //     });
  //     if (!response.ok) throw Error(`Could not fetch...`);
  //     return await response.json();
  //   },
  // });
  padNumberToFourDigits(value: number): string {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Giá trị phải là một số nguyên không âm.');
    }
    return value.toString().padStart(4, '0');
  }
  goToPreviousWeek() {
    if (this._countWeek > 1) this._countWeek--;
  }
  goToNextWeek() {
    if (this._countWeek < 40) this._countWeek++;
  }
  goToThisWeek() {
    this._countWeek = this._currentPregnancyWeek;
  }
  // Form tính ngày dự sinh

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

      this._expectedDate = dueDate;
      this.formatDate = this._expectedDate.toLocaleDateString('vi-VN');
    }
  }

  //tooltip for Hôm nay mẹ đi khám
  @Input() tooltip: string;
  readonly dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(DialogContentPriceComponent);
  }
  //end Tooltip

  constructor(private _recordService: PregnancyRecordService) {
    this._recordService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
      this.metrics.forEach((metric) => {
        if (metric.title == 'Cân nặng') {
          this.weightMetricId = metric.metric_id;
        }
      });
      console.log(this.metrics);
    });
  }
}
