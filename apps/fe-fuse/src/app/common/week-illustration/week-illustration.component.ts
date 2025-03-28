import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSplideComponent, NgxSplideModule } from 'ngx-splide';
import { SystemReminder, SystemReminders } from '../../mock-api/system-remind.data';

@Component({
  selector: 'app-week-illustration',
  standalone: true,
  imports: [NgxSplideModule, CommonModule],
  templateUrl: './week-illustration.component.html',
  styleUrl: './week-illustration.component.css',
  animations: [
    trigger('stageAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class WeekIllustrationComponent implements OnInit {
  @ViewChild(NgxSplideComponent) splideComponent: NgxSplideComponent;

  weekImageArray: { src: string; alt: string }[] = [];
  splideOptions = {
    type: 'loop',
    perPage: 1,
    keyboard: false,
    arrows: false,
    pagination: false,
    drag: false,
    autoplay: false,
    speed: 0, // Instant transition with no animation
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Smooth easing function
  };

  private _countWeek: number = 1;
  private splideInstance: any = null;
  private splideInitialized: boolean = false;

  get countWeek(): number {
    return this._countWeek;
  }

  set countWeek(value: number) {
    this._countWeek = value;
    this.updateSplideSlide();
  }

  @Input() currentPregnancyWeek: number = this.countWeek;

  // Week as string with leading zero for image path
  get countWeekString(): string {
    return this.countWeek.toString().padStart(4, '0');
  }

  private _progressWidth: number = 0;

  // Progress percentage (1-40 weeks)
  get progressWidth(): number {
    return Math.min(Math.round((this.countWeek / 40) * 100), 100);
  }

  SystemReminders: SystemReminder[] = SystemReminders;

  isMobile: boolean = false;
  isPlaying: boolean = true;
  private autoPlayInterval: any;
  initialLoadComplete: boolean = false;

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.generateWeekImageArray();

    // Default to week 1 if not provided
    if (!this._countWeek || this._countWeek < 1) {
      this._countWeek = 1;
    }

    // Ensure week is within valid range
    if (this._countWeek > 40) {
      this._countWeek = 40;
    }
  }

  onSplideInit(splide: any) {
    this.splideInstance = splide;
    this.splideInitialized = true;

    // Start animation only after Splide is initialized
    setTimeout(() => {
      this.animateToCurrentWeek();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  generateWeekImageArray() {
    for (let i = 1; i <= 40; i++) {
      const weekString = i.toString().padStart(4, '0');
      this.weekImageArray.push({
        src: `/images/fetal-growth/Female_View_${weekString}.jpg`,
        alt: `mẹ tuần ${weekString}`,
      });
    }
  }

  updateSplideSlide() {
    if (this.splideInstance && this.splideInitialized) {
      // Adjust for 0-based index in Splide
      this.splideInstance.go(this._countWeek);
    }
  }

  animateToCurrentWeek() {
    if (this.currentPregnancyWeek <= 1) {
      this._countWeek = this.currentPregnancyWeek;
      this.updateProgress();
      this.initialLoadComplete = true;
      return;
    }

    // Start from week 1
    this._countWeek = 1;
    this.updateProgress();

    // Use setTimeout to create animation effect with smoother transition
    let animationSpeed = 150; // Initial speed (faster at beginning)

    const animationInterval = setInterval(() => {
      if (this._countWeek < this.currentPregnancyWeek) {
        this._countWeek++;
        this.updateProgress();
        this.updateSplideSlide();

        // Gradually slow down animation as we approach the current week
        if (this._countWeek > this.currentPregnancyWeek - 5) {
          animationSpeed = 200;
        }
      } else {
        clearInterval(animationInterval);
        this.initialLoadComplete = true;
        // this.startAutoPlay();
      }
    }, animationSpeed);
  }

  // toggleAutoPlay() {
  //   this.isPlaying = !this.isPlaying;
  //   if (this.isPlaying) {
  //     this.startAutoPlay();
  //   } else {
  //     this.stopAutoPlay();
  //   }
  // }

  nextStage() {
    if (this._countWeek < 40) {
      this._countWeek++;
      this.updateProgress();
      this.updateSplideSlide();
    }
  }

  previousStage() {
    if (this._countWeek > 0) {
      this._countWeek--;
      this.updateProgress();
      this.updateSplideSlide();
    }
  }

  // private startAutoPlay() {
  //   if (this.isPlaying && this.initialLoadComplete) {
  //     this.autoPlayInterval = setInterval(() => {
  //       if (this._countWeek < 40) {
  //         this.nextStage();
  //       } else {
  //         this.stopAutoPlay();
  //       }
  //     }, 3000);
  //   }
  // }

  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private updateProgress() {
    this._progressWidth = (this._countWeek / 40) * 100;
  }

  //hàm trả về true nếu countweek bé hơn hoặc bằng currentPregnancyWeek
  isComplete() {
    return this._countWeek <= this.currentPregnancyWeek;
  }

  // Go to specific week
  goToWeek(): void {
    this._countWeek = this.currentPregnancyWeek;
    this.updateProgress();
    this.updateSplideSlide();
  }

  // Get system reminder message based on current week
  getSystemReminderMessage(): string {
    // Early pregnancy (weeks 1-13)
    if (this._countWeek <= 13) {
      if (this._countWeek <= 4) {
        return 'Bé của mẹ đang trong giai đoạn phôi thai. Các tế bào đang phân chia nhanh chóng để hình thành các cấu trúc cơ bản.';
      } else if (this._countWeek <= 8) {
        return 'Tim bé đã bắt đầu đập, não và tủy sống đang phát triển. Các nụ nhỏ sẽ phát triển thành tay và chân.';
      } else {
        return 'Các cơ quan nội tạng đã hình thành. Mặt bé đã có đầy đủ mắt, mũi, miệng. Ngón tay và ngón chân bắt đầu tách biệt.';
      }
    }

    // Second trimester (weeks 14-27)
    else if (this._countWeek <= 27) {
      if (this._countWeek <= 18) {
        return 'Bé đã có thể nghe được âm thanh từ bên ngoài. Da bé bắt đầu dày lên và phát triển lông tơ để bảo vệ.';
      } else {
        return 'Các giác quan của bé đang phát triển. Bé đã có thể cử động nhiều hơn và mẹ có thể cảm nhận được. Bé đã có thể đáp ứng với ánh sáng và âm thanh.';
      }
    }

    // Third trimester (weeks 28-40)
    else {
      if (this._countWeek <= 35) {
        return 'Bé đang tăng cân nhanh chóng. Phổi đang phát triển để chuẩn bị cho việc hô hấp khi chào đời. Não bộ đang phát triển nhanh chóng.';
      } else {
        return 'Bé đã gần như phát triển hoàn thiện và đang chuẩn bị cho ngày chào đời. Bé có thể nằm ở tư thế đầu hướng xuống để chuẩn bị cho quá trình sinh.';
      }
    }
  }
}
