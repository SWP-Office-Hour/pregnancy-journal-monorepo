import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { MetricResponseType, Status } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { PregnancyRecordService } from '../../customer/pregnancy-record/pregnancy-record.service';
import { PregnancyWeekInfoComponent } from '../pregnancy-week-info/pregnancy-week-info.component';
import { RecommendedBlogsComponent } from '../recommended-blogs/recommended-blogs.component';

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
    TooltipModule,
    PregnancyWeekInfoComponent,
    ButtonModule,
    NgxSplideModule,
    MatSlider,
    MatSliderThumb,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  //Thai nhi

  weekData = {
    '0001': { dueDate: '280', dueDateFormatted: '01/01/2025', size: '0.1mm', sizeDescription: 'Bằng hạt anh túc' },
    '0002': { dueDate: '273', dueDateFormatted: '02/01/2025', size: '0.2mm', sizeDescription: 'Bằng hạt cải' },
    '0003': { dueDate: '266', dueDateFormatted: '03/01/2025', size: '0.4mm', sizeDescription: 'Bằng hạt vừng' },
    '0004': { dueDate: '259', dueDateFormatted: '04/01/2025', size: '0.8mm', sizeDescription: 'Bằng hạt gạo' },
    '0005': { dueDate: '252', dueDateFormatted: '05/01/2025', size: '2mm', sizeDescription: 'Bằng hạt đậu' },
    '0006': { dueDate: '245', dueDateFormatted: '06/01/2025', size: '4mm', sizeDescription: 'Bằng hạt đậu xanh' },
    '0007': { dueDate: '238', dueDateFormatted: '07/01/2025', size: '8mm', sizeDescription: 'Bằng quả nho' },
    '0008': { dueDate: '231', dueDateFormatted: '08/01/2025', size: '16mm', sizeDescription: 'Bằng quả dâu' },
    '0009': { dueDate: '224', dueDateFormatted: '09/01/2025', size: '23mm', sizeDescription: 'Bằng quả ô liu' },
    '0010': { dueDate: '217', dueDateFormatted: '10/01/2025', size: '30mm', sizeDescription: 'Bằng quả mận' },
    '0011': { dueDate: '210', dueDateFormatted: '11/01/2025', size: '38mm', sizeDescription: 'Bằng quả sung' },
    '0012': { dueDate: '203', dueDateFormatted: '12/01/2025', size: '45mm', sizeDescription: 'Bằng quả chanh' },
    '0013': { dueDate: '196', dueDateFormatted: '13/01/2025', size: '55mm', sizeDescription: 'Bằng quả đào' },
    '0014': { dueDate: '189', dueDateFormatted: '14/01/2025', size: '65mm', sizeDescription: 'Bằng quả lê' },
    '0015': { dueDate: '182', dueDateFormatted: '15/01/2025', size: '75mm', sizeDescription: 'Bằng quả táo' },
    '0016': { dueDate: '175', dueDateFormatted: '16/01/2025', size: '85mm', sizeDescription: 'Bằng quả bơ' },
    '0017': { dueDate: '168', dueDateFormatted: '17/01/2025', size: '95mm', sizeDescription: 'Bằng quả cam' },
    '0018': { dueDate: '161', dueDateFormatted: '18/01/2025', size: '105mm', sizeDescription: 'Bằng quả xoài' },
    '0019': { dueDate: '154', dueDateFormatted: '19/01/2025', size: '115mm', sizeDescription: 'Bằng quả đu đủ' },
    '0020': { dueDate: '147', dueDateFormatted: '20/01/2025', size: '125mm', sizeDescription: 'Bằng quả dừa' },
    '0021': { dueDate: '140', dueDateFormatted: '21/01/2025', size: '135mm', sizeDescription: 'Bằng quả dưa hấu nhỏ' },
    '0022': { dueDate: '133', dueDateFormatted: '22/01/2025', size: '145mm', sizeDescription: 'Bằng quả dưa gang' },
    '0023': { dueDate: '126', dueDateFormatted: '23/01/2025', size: '155mm', sizeDescription: 'Bằng quả bưởi' },
    '0024': { dueDate: '119', dueDateFormatted: '24/01/2025', size: '165mm', sizeDescription: 'Bằng quả mít' },
    '0025': { dueDate: '112', dueDateFormatted: '25/01/2025', size: '175mm', sizeDescription: 'Bằng quả dừa xiêm' },
    '0026': { dueDate: '105', dueDateFormatted: '26/01/2025', size: '185mm', sizeDescription: 'Bằng quả dưa hấu' },
    '0027': { dueDate: '98', dueDateFormatted: '27/01/2025', size: '195mm', sizeDescription: 'Bằng bắp cải' },
    '0028': { dueDate: '91', dueDateFormatted: '28/01/2025', size: '205mm', sizeDescription: 'Bằng quả bí đỏ nhỏ' },
    '0029': { dueDate: '84', dueDateFormatted: '29/01/2025', size: '215mm', sizeDescription: 'Bằng quả bí đỏ' },
    '0030': { dueDate: '77', dueDateFormatted: '30/01/2025', size: '225mm', sizeDescription: 'Bằng quả bí ngô' },
    '0031': { dueDate: '70', dueDateFormatted: '31/01/2025', size: '235mm', sizeDescription: 'Bằng quả bầu' },
    '0032': { dueDate: '63', dueDateFormatted: '01/02/2025', size: '245mm', sizeDescription: 'Bằng quả mướp' },
    '0033': { dueDate: '56', dueDateFormatted: '02/02/2025', size: '255mm', sizeDescription: 'Bằng quả su su' },
    '0034': { dueDate: '49', dueDateFormatted: '03/02/2025', size: '265mm', sizeDescription: 'Bằng quả đu đủ lớn' },
    '0035': { dueDate: '42', dueDateFormatted: '04/02/2025', size: '275mm', sizeDescription: 'Bằng quả dưa hấu lớn' },
    '0036': { dueDate: '35', dueDateFormatted: '05/02/2025', size: '285mm', sizeDescription: 'Bằng quả bí đao' },
    '0037': { dueDate: '28', dueDateFormatted: '06/02/2025', size: '295mm', sizeDescription: 'Bằng quả bí rợ' },
    '0038': { dueDate: '21', dueDateFormatted: '07/02/2025', size: '305mm', sizeDescription: 'Bằng quả mít to' },
    '0039': { dueDate: '14', dueDateFormatted: '08/02/2025', size: '315mm', sizeDescription: 'Bằng quả bí đỏ to' },
    '0040': { dueDate: '7', dueDateFormatted: '09/02/2025', size: '325mm', sizeDescription: 'Bằng em bé sơ sinh' },
  };
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
  public get countWeekNumber(): number {
    return this._countWeek;
  }
  standardResource = [
    { week: 1, weight: 0 },
    { week: 2, weight: 0 },
    { week: 3, weight: 0 },
    { week: 4, weight: 0 },
    { week: 5, weight: 0 },
    { week: 6, weight: 0 },
    { week: 7, weight: 0 },
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
    { week: 40, weight: 3290 },
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

  constructor(private _recordService: PregnancyRecordService) {
    this._recordService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
      this.metrics.forEach((metric) => {
        if (metric.title == 'Cân nặng') {
          this.weightMetricId = metric.metric_id;
        }
      });
      // console.log(this.metrics);
    });
  }

  //hàm thay đổi giá trị của slider
  onSliderChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this._countWeek = Number(inputElement.value) <= 1 ? 1 : Number(inputElement.value);

    console.log(this._countWeek);
  }
  // protected readonly TrackedIncrementalBuildStrategy = TrackedIncrementalBuildStrategy;
  protected readonly Number = Number;
}
