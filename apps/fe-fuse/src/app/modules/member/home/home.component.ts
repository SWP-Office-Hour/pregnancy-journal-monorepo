import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, WritableSignal } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSplideModule } from 'ngx-splide';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { environment } from '../../../../environments/environment';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { SystemReminder, SystemReminders } from '../../../mock-api/system-remind.data';
import { PregnancyRecordService } from '../../customer/pregnancy-record/pregnancy-record.service';
import { HomeReminderComponent } from '../home-reminder/home-reminder.component';
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
    ButtonModule,
    NgxSplideModule,
    RouterLink,
    HomeReminderComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: 'home.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public systemRemind: WritableSignal<SystemReminder | null> = null;
  public formatDate: string;
  countDownForm = new FormGroup({
    lastMenstrualPeriod: new FormControl('', Validators.required),
    menstrualCycle: new FormControl('', Validators.required),
  });
  isButtonHovered = false;
  //1. Lấy User
  //get data standard of metric from API
  protected metrics: MetricResponseType[];
  protected weightMetricId: string;
  protected readonly Status = Status;
  protected lastRecord: RecordResponse | null = null;
  protected user: User | null = null;
  //2. Lấy ngày đẻ
  private _expectedDate: Date = new Date();
  //3. Tính tuần thai
  private _currentPregnancyWeek: number = 4;

  constructor(
    private _recordService: PregnancyRecordService,
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _childService: ChildV2Service,
  ) {
    this._userService.user$.subscribe((user) => {
      this.user = user;
      this._childService.child$.subscribe((child) => {
        console.log('Selected child:', child);
        this._expectedDate = new Date(child.expected_birth_date);
        this.calculateCurrentPregnancyWeek();
        this._countWeek = this._currentPregnancyWeek;
        const remindForThisWeek = SystemReminders.find((item) => item.week === this._currentPregnancyWeek);
        if (remindForThisWeek) {
          this.systemRemind.set(remindForThisWeek);
        }
      });
    });
    this._recordService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
      this.metrics.forEach((metric) => {
        if (metric.title == 'Cân nặng') {
          this.weightMetricId = metric.metric_id;
        }
      });
    });

    this._httpClient
      .get<{
        total: number;
        data: RecordResponse[];
      }>(`${environment.apiUrl}record`)
      .subscribe((records) => {
        if (records.total > 0) {
          this.lastRecord = records.data[0];
          this.calculateCurrentPregnancyWeek();
          this._countWeek = this._currentPregnancyWeek;
        }
      });
  }

  private _countWeek: number = this._currentPregnancyWeek;

  public get countWeek(): string {
    return this._countWeek.toString().padStart(4, '0');
  }

  public get countWeekNumber(): number {
    return this._countWeek;
  }

  remainingDays() {
    const expectedDate = new Date(this._expectedDate);
    const currentDate = new Date();
    return Math.floor((expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Form tính ngày dự sinh

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
}
