import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardPaymentType, DashboardType } from '@pregnancy-journal-monorepo/contract';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-member-combo',
  template: `<div class="card">
    <div class="mb-4 text-2xl font-semibold">thống kê tiền và gói bán theo tháng</div>
    <p-chart type="line" [data]="data" [options]="options" class="h-80" />
  </div>`,
  standalone: true,
  imports: [ChartModule],
})
export class MembershipAnalysis implements OnInit {
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
            type: 'bar',
            label: 'Số gói đã bán được hàng tháng',
            backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
            data: payment.membership,
            borderColor: 'white',
            borderWidth: 2,
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
