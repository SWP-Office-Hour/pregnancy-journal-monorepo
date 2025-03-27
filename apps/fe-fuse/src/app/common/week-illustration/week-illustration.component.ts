import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NgxSplideModule } from 'ngx-splide';
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
  countWeek: number = 1;
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

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.startAutoPlay();
    this.updateProgress();

    // Default to week 1 if not provided
    if (!this.countWeek || this.countWeek < 1) {
      this.countWeek = 1;
    }

    // Ensure week is within valid range
    if (this.countWeek > 40) {
      this.countWeek = 40;
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleAutoPlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  nextStage() {
    if (this.countWeek < 40) {
      this.countWeek++;
      this.updateProgress();
    }
  }

  previousStage() {
    if (this.countWeek > 0) {
      this.countWeek--;
      this.updateProgress();
    }
  }

  private startAutoPlay() {
    if (this.isPlaying) {
      this.autoPlayInterval = setInterval(() => {
        if (this.countWeek < 40) {
          this.nextStage();
        } else {
          this.stopAutoPlay();
        }
      }, 3000);
    }
  }

  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private updateProgress() {
    this._progressWidth = (this.countWeek / 40) * 100;
  }

  //hàm trả về true nếu countweek bé hơn hoặc bằng currentPregnancyWeek
  isComplete() {
    return this.countWeek <= this.currentPregnancyWeek;
  }

  // Go to specific week
  goToWeek(): void {
    this.countWeek = this.currentPregnancyWeek;
    this.updateProgress();
  }

  // Get system reminder message based on current week
  getSystemReminderMessage(): string {
    // Early pregnancy (weeks 1-13)
    if (this.countWeek <= 13) {
      if (this.countWeek <= 4) {
        return 'Bé của mẹ đang trong giai đoạn phôi thai. Các tế bào đang phân chia nhanh chóng để hình thành các cấu trúc cơ bản.';
      } else if (this.countWeek <= 8) {
        return 'Tim bé đã bắt đầu đập, não và tủy sống đang phát triển. Các nụ nhỏ sẽ phát triển thành tay và chân.';
      } else {
        return 'Các cơ quan nội tạng đã hình thành. Mặt bé đã có đầy đủ mắt, mũi, miệng. Ngón tay và ngón chân bắt đầu tách biệt.';
      }
    }

    // Second trimester (weeks 14-27)
    else if (this.countWeek <= 27) {
      if (this.countWeek <= 18) {
        return 'Bé đã có thể nghe được âm thanh từ bên ngoài. Da bé bắt đầu dày lên và phát triển lông tơ để bảo vệ.';
      } else {
        return 'Các giác quan của bé đang phát triển. Bé đã có thể cử động nhiều hơn và mẹ có thể cảm nhận được. Bé đã có thể đáp ứng với ánh sáng và âm thanh.';
      }
    }

    // Third trimester (weeks 28-40)
    else {
      if (this.countWeek <= 35) {
        return 'Bé đang tăng cân nhanh chóng. Phổi đang phát triển để chuẩn bị cho việc hô hấp khi chào đời. Não bộ đang phát triển nhanh chóng.';
      } else {
        return 'Bé đã gần như phát triển hoàn thiện và đang chuẩn bị cho ngày chào đời. Bé có thể nằm ở tư thế đầu hướng xuống để chuẩn bị cho quá trình sinh.';
      }
    }
  }
}
