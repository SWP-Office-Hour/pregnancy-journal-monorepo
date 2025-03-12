import { Component, effect, resource } from '@angular/core';
import { DashboardType, DashboardUserType } from '@pregnancy-journal-monorepo/contract';
import { ChartModule } from 'primeng/chart';
import { environment } from '../../../environments/environment';

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

  dashboardResource = resource<DashboardType, {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'admin/dashboard', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  constructor() {
    //dùng để coi giá trị của resource
    effect(() => {
      console.log(this.dashboardResource.value());
      const dashboard = this.dashboardResource.value();
      this.initChart(dashboard.user);
    });
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
          label: 'Member',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: chartData.memberData,
        },
        {
          label: 'Subscriber',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          borderColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: chartData.subscriberData,
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
