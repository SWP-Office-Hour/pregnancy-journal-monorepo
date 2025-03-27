import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ChildType, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSplideModule } from 'ngx-splide';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';
import { PopularToolComponent } from '../../../common/popular-tool/popular-tool.component';
import { WeekIllustrationComponent } from '../../../common/week-illustration/week-illustration.component';
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
    NgClass,
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    TooltipModule,
    ButtonModule,
    NgxSplideModule,
    HomeReminderComponent,
    PopularToolComponent,
    RecommendedBlogsComponent,
    WeekIllustrationComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: 'home.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // ---------- Prop -----------
  public systemRemind: WritableSignal<SystemReminder | null> = signal(null);
  public formatDate: string;
  timeOfDay;
  child: ChildType;

  //get data standard of metric from API
  protected metrics: MetricResponseType[];
  protected weightMetricId: string;
  protected readonly Status = Status;
  protected lastRecord: RecordResponse | null = null;
  protected user: User | null = null;
  //2. Lấy ngày đẻ của con mà người dùng đã chọn
  private _expectedDate: Date = new Date();

  //----------- Constructor -------------
  constructor(
    private _recordService: PregnancyRecordService,
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _childService: ChildV2Service,
    private router: Router,
    private childService: ChildV2Service,
  ) {
    // Initialize any required properties
    this.updateTimeOfDay();

    this.childService.child$.subscribe((data) => {
      this.child = data;
    });

    // Update the time of day every minute
    setInterval(() => {
      this.updateTimeOfDay();
    }, 60000); // 60000ms = 1 minute

    this._userService.user$.subscribe((user) => {
      this.user = user;
      this._childService.child$.subscribe((child) => {
        console.log('Selected child:', child);
        this._expectedDate = new Date(child.expected_birth_date);
        this.calculateCurrentPregnancyWeek();
        this._countWeek = this._currentPregnancyWeek;
        const remindForThisWeek = SystemReminders.find((item) => item.week === this._currentPregnancyWeek);
        if (remindForThisWeek) {
          console.log('Remind for this week:', remindForThisWeek);
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

  //-------- Recommmend info week Block ----------
  //3. Tính tuần thai
  private _currentPregnancyWeek: number = 4;
  private _countWeek: number = this._currentPregnancyWeek;
  protected get currentPregnancyWeek(): number {
    return this._currentPregnancyWeek;
  }
  remainingDays() {
    const expectedDate = new Date(this._expectedDate);
    const currentDate = new Date();
    return Math.floor((expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  }
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

  //-------- Welcome Block ----------
  // Method to determine the time of day for UI changes
  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon';
    } else if (hour >= 18 && hour < 23) {
      return 'evening';
    } else {
      return 'night';
    }
  }
  // Update the time of day
  updateTimeOfDay(): void {
    this.timeOfDay = this.getTimeOfDay();
  }
  // Get the appropriate greeting based on time
  getGreetingMessage(): string {
    const timeOfDay = this.getTimeOfDay();

    switch (timeOfDay) {
      case 'morning':
        return 'Chào buổi sáng,';
      case 'afternoon':
        return 'Chào buổi chiều,';
      case 'evening':
        return 'Chúc buổi tối an lành,';
      case 'night':
        return 'Đã khuya rồi,';
      default:
        return 'Xin chào,';
    }
  }
  // Get time-specific emoji
  getTimeEmoji(): string {
    const timeOfDay = this.getTimeOfDay();

    switch (timeOfDay) {
      case 'morning':
        return '☀️';
      case 'afternoon':
        return '🌤️';
      case 'evening':
        return '🌙';
      case 'night':
        return '😴';
      default:
        return '👋';
    }
  }
  // Get time-specific message
  getTimeMessage(): string {
    const timeOfDay = this.getTimeOfDay();
    switch (timeOfDay) {
      case 'morning':
        return 'Chúc bạn có một ngày tràn đầy năng lượng!';
      case 'afternoon':
        return 'Hôm nay bé cưng có ngoan không nào?';
      case 'evening':
        return 'Hãy nghỉ ngơi thật tốt nhé!';
      case 'night':
        return 'Nghỉ ngơi để bé yêu khỏe mạnh nhé!';
      default:
        return 'Chúc bạn và bé luôn khỏe mạnh!';
    }
  }

  //-------- Reminder Block ----------
  createRecord() {
    this.router.navigate(['/tracking'], { queryParams: { create: true } });
  }
}
