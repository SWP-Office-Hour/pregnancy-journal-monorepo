import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTime } from 'luxon';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-line-chart',
  imports: [ChartComponent, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit {
  chartData: ApexOptions;
  @Input() multi_data: {
    name: string;
    data: { timestamp: DateTime; value: number }[];
  }[];

  ngOnInit() {
    console.log('multi_data', this.multi_data);
    this.prepareChartData();
  }

  prepareChartData() {
    this.chartData = {
      chart: {
        animations: {
          enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'area',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      series:
        this.multi_data?.map((data) => {
          return {
            data: data.data.map((d) => {
              return {
                x: d.timestamp.toJSDate(),
                y: d.value,
              };
            }),
            name: data.name,
          };
        }) || [],
      colors: ['#64748B', '#94A3B8'],
      dataLabels: {
        enabled: false,
      },
      fill: {
        colors: ['#64748B', '#94A3B8'],
        opacity: 0.5,
      },
      grid: {
        show: false,
        padding: {
          bottom: -40,
          left: 0,
          right: 0,
        },
      },
      legend: {
        show: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      tooltip: {
        followCursor: true,
        theme: 'dark',
        x: {
          format: 'MMM dd, yyyy',
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        labels: {
          offsetY: -20,
          rotate: 0,
          style: {
            colors: 'var(--fuse-text-secondary)',
          },
        },
        tickAmount: 3,
        tooltip: {
          enabled: false,
        },
        type: 'datetime',
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--fuse-text-secondary)',
          },
        },
        max: (max): number => max + 25,
        min: (min): number => min - 25,
        show: false,
        tickAmount: 5,
      },
    };
  }
}
