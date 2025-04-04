import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardPaymentType, DashboardType } from '@pregnancy-journal-monorepo/contract';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-combo',
  template: `<div class="card">
    <div class="mb-4 text-2xl font-semibold">Thống kê tiền và gói bán theo tháng</div>
    <p-chart type="line" [data]="data" [options]="options" class="h-80" />
  </div>`,
  standalone: true,
  imports: [ChartModule],
})
export class ChartCombo implements OnInit {
  data: any;
  @Input() dashboardResource: DashboardType;
  options: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart(this.dashboardResource.payment);
  }

  initChart(payment: DashboardPaymentType) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.data = {
        labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
        datasets: [
          {
            type: 'line',
            label: 'Tổng thu nhập hàng tháng',
            borderColor: documentStyle.getPropertyValue('--p-orange-500'),
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: payment.payment,
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: 'transparent',
              borderColor: 'transparent',
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              borderColor: 'transparent',
              drawTicks: false,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
