import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgForOf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { BlogResponseType, CategoryResponse, ChildType, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSplideModule } from 'ngx-splide';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';
import { BabyNameFinderComponent } from '../../../common/baby-name-finder/baby-name-finder.component';
import { CalculateDueDateComponent } from '../../../common/calculate-due-date/calculate-due-date.component';
import { WeekPregnancySliderComponent } from '../../../common/week-pregnancy-slider/week-pregnancy-slider.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { SystemReminder, SystemReminders } from '../../../mock-api/system-remind.data';
import { BlogMasonryService } from '../../blog-masonry/blog-masonry.service';
import { PregnancyRecordService } from '../../customer/pregnancy-record/pregnancy-record.service';
import { HomeReminderComponent } from '../home-reminder/home-reminder.component';

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
    MatDialogModule,
    WeekPregnancySliderComponent,
    DatePipe,
    NgStyle,
    RouterLink,
    NgForOf,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: 'home.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public systemRemind: WritableSignal<SystemReminder | null> = signal(null);
  public formatDate: string;
  timeOfDay;
  readonly dialog = inject(MatDialog);
  //get data standard of metric from API
  protected metrics: MetricResponseType[];
  protected weightMetricId: string;
  protected readonly Status = Status;
  protected lastRecord: RecordResponse | null = null;
  protected user: User | null = null;
  //2. Lấy ngày đẻ của con mà người dùng đã chọn
  private _expectedDate: Date = new Date();

  blogs: BlogResponseType[] = [];
  categories: CategoryResponse[] = [];
  items: MenuItem[] | undefined;
  recommendedBlogs: BlogResponseType[] = [];
  child: ChildType;

  // Properties to track the currently displayed featured blogs
  featuredMainBlog: BlogResponseType | null = null;
  featuredLeftBlogs: BlogResponseType[] = [];
  featuredRightBlogs: BlogResponseType[] = [];

  currentPage = 1;
  totalPages = 0;

  tickerPosition = 0;
  //   gallery
  currentIndex = 0;
  carouselItems: BlogResponseType[] = [];
  private tickerInterval: any;
  private autoSlideInterval: any;

  constructor(
    private _recordService: PregnancyRecordService,
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _childService: ChildV2Service,
    private router: Router,
    private blogService: BlogMasonryService,
    private _authService: AuthService,
    private childService: ChildV2Service,
  ) {
    // Initialize any required properties
    this.updateTimeOfDay();

    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
    this.loadBlogs();
    this.loadRecommendedBlogs();
    this.startTicker();
    this.startAutoSlide();
    this.items = [
      { icon: 'pi pi-home', route: '/home' },
      { label: 'Bài viết', route: '/authenticated/blog' },
    ];

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

  // In home.component.ts
  loadRecommendedBlogs(): void {
    // Get tags for the child
    if (!this.child || !this.child.child_id) {
      console.log('No child data available yet');
      return;
    }

    this.blogService.getTagByChildId(this.child.child_id).subscribe((response) => {
      if (response) {
        // Extract tag IDs
        const tagIds = response.map((tag) => tag.tag_id);
        // Get blog recommendations based on tags
        this.blogService.getBlogRecommendationByTagArray(tagIds).subscribe((result) => {
          console.log('Recommended blogs loaded:', result);
          this.recommendedBlogs = result.blogs;
          this.carouselItems = this.recommendedBlogs; // Update carousel items too

          if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
            // Explicitly initialize the carousel
            this.currentIndex = 0;
          } else {
            // Fallback to regular blogs
            this.recommendedBlogs = [...this.blogs].slice(0, 5);
            this.carouselItems = this.recommendedBlogs;
          }
        });
      } else {
        // Fallback if no tags
        this.recommendedBlogs = [...this.blogs].slice(0, 5);
        this.carouselItems = this.recommendedBlogs;
      }
    });
  }

  loadBlogs(categoryId: string = ''): void {
    this.blogService.getBlogs(categoryId, this.currentPage).subscribe((data) => {
      this.totalPages = data.total_page;
      this.blogs = data.blogs;

      // Only use as fallback if recommendations haven't loaded
      if (this.recommendedBlogs.length === 0) {
        this.recommendedBlogs = [...this.blogs].slice(0, 5);
      }

      this.updateFeaturedBlogs();
    });
  }

  // Method to update the featured blogs when the blog list changes
  updateFeaturedBlogs(): void {
    this.featuredMainBlog = this.blogs.length > 0 ? this.blogs[0] : null;
    this.featuredLeftBlogs = this.blogs.length > 1 ? this.blogs.slice(1, 3) : [];
    this.featuredRightBlogs = this.blogs.length > 3 ? this.blogs.slice(3, 5) : [];
  }

  ngOnDestroy() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
    }
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.recommendedBlogs.length;
    }
  }

  prevSlide() {
    console.log(this.recommendedBlogs);
    console.log(this.currentIndex);
    if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
      this.currentIndex = this.currentIndex === 0 ? this.recommendedBlogs.length - 1 : this.currentIndex - 1;
    }
  }

  goToSlide(index: number) {
    if (this.recommendedBlogs && index >= 0 && index < this.recommendedBlogs.length) {
      this.currentIndex = index;
    }
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';
  }

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.tickerPosition--;
      if (this.tickerPosition < -1000) {
        this.tickerPosition = 0;
      }
    }, 30);
  }

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

  openFirstTool() {
    const dialogRef = this.dialog.open(BabyNameFinderComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSecondTool() {
    const dialogRef = this.dialog.open(CalculateDueDateComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openThirdTool() {
    const dialogRef = this.dialog.open(WeekPregnancySliderComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createRecord() {
    this.router.navigate(['/tracking'], { queryParams: { create: true } });
  }
}
