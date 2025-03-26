import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSplideModule } from 'ngx-splide';
import { StyleClass } from 'primeng/styleclass';
import { PregnancyWeekInfoComponent } from '../../modules/member/pregnancy-week-info/pregnancy-week-info.component';
import { WeekIllustrationComponent } from '../week-illustration/week-illustration.component';

@Component({
  selector: 'app-week-pregnancy-slider',
  imports: [NgFor, CommonModule, NgxSplideModule, WeekIllustrationComponent, PregnancyWeekInfoComponent, StyleClass],
  templateUrl: './week-pregnancy-slider.component.html',
  styleUrl: './week-pregnancy-slider.component.css',
})
export class WeekPregnancySliderComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  pregnancyWeeks: number[] = Array(40)
    .fill(1)
    .map((_, i) => i + 2);
  currentWeek: number = 16; // Default to a middle week, update with actual pregnancy week

  // Sample size comparisons (update with actual data)
  weekSizeComparisons: string[] = [
    'Hạt anh túc',
    'Hạt vừng',
    'Hạt đậu lăng',
    'Quả việt quất',
    'Quả mâm xôi',
    'Quả nho',
    'Quả dâu',
    'Quả sung',
    'Quả chanh',
    'Quả mận',
    'Quả chanh vàng',
    'Quả táo',
    'Quả bơ',
    'Củ cải',
    'Quả ớt chuông',
    'Quả lựu',
    'Quả chuối',
    'Quả xoài',
    'Củ khoai lang',
    'Quả cam',
    'Quả bắp',
    'Quả bí đao',
    'Quả bí sợi mì',
    'Bông cải trắng',
    'Quả cà tím',
    'Quả bí ngô nhỏ',
    'Bắp cải',
    'Quả dừa',
    'Quả đu đủ',
    'Quả dứa',
    'Quả dưa lưới vàng',
    'Quả dưa lưới xanh',
    'Cải xanh lớn',
    'Cải cầu vồng',
    'Quả dưa hấu nhỏ',
    'Quả bí ngô',
    'Quả dưa hấu lớn',
    'Quả Em bé',
  ];

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToCurrentWeek(), 500);
  }

  scrollToCurrentWeek(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    const weekCards = container.querySelectorAll('.week-card');
    if (weekCards.length >= this.currentWeek) {
      const targetCard = weekCards[this.currentWeek - 1];
      const containerWidth = container.offsetWidth;
      const cardWidth = targetCard.offsetWidth;

      // Center the current week card
      const scrollPosition = targetCard.offsetLeft - containerWidth / 2 + cardWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }

  // Helper function to get the correct image week
  getImageWeek(week: number): string {
    // Images may not exist for all 40 weeks
    // Map the week number to available images
    if (week > 41) return '41';
    return week.toString();
  }
}
