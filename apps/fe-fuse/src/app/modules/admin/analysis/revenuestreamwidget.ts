import { Component, Input, OnInit } from '@angular/core';
import { DashboardType, DashboardUserType } from '@pregnancy-journal-monorepo/contract';
import _default from 'chart.js/dist/plugins/plugin.tooltip';
import { ChartModule } from 'primeng/chart';
import borderColor = _default.defaults.borderColor;

@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [ChartModule],
  template: `
    <div class="card !mb-8 rounded-2xl bg-white p-5">
      <div class="mb-4 text-2xl font-semibold">Người dùng theo tháng</div>
      <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>
  `,
})
export class RevenueStreamWidget implements OnInit {
  chartData: any;
  chartOptions: any;
  @Input() dashboardResource: DashboardType;

  constructor() {
    //dùng để coi giá trị của resource
  }

  initChart(chartData: DashboardUserType) {
    console.log('chartData', chartData);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData = {
      labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      datasets: [
        {
          label: 'Tài khoản mua gói',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: chartData.subscriberData,
        },
        {
          label: 'Tài khoản',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          borderColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: chartData.memberData,
        },
      ],
    };

    this.chartOptions = {
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
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: 'transparent',
            borderColor: 'transparent',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: borderColor,
            borderColor: 'transparent',
            drawTicks: false,
          },
        },
      },
    };
  }

  ngOnInit(): void {
    console.log(this.dashboardResource);
    this.initChart(this.dashboardResource.user);
  }
}
