import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

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
export class RevenueStreamWidget {
  chartData: any;
  chartOptions: any;

  constructor() {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData = {
      labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      datasets: [
        {
          label: 'Member',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: [65, 59, 80],
        },
        {
          label: 'Subscriber',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          borderColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: [28, 48, 40],
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
}
