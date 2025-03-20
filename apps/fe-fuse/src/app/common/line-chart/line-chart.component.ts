import { CommonModule, NgStyle } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { PregnancyTrackingService } from '../../modules/customer/pregnancy-tracking/pregnancy-tracking.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-line-chart',
  imports: [ChartComponent, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, NgStyle, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  selectedPeriod: string = '30 days';
  periods = [
    { label: '30 days', days: 30 },
    { label: '3 months', days: 90 },
    { label: '9 months', days: 270 },
  ];

  title: string = 'Theo dõi chỉ số';

  getRecordDataForChart() {
    const data_for_chart: RecordDataForChart[] = this.metrics.map((metric) => {
      return {
        name: metric.title,
        data: [],
      };
    });

    this.recordsData().forEach((record) => {
      record.data.forEach((data) => {
        const metric = this.metrics.find((m) => m.metric_id == data.metric_id);
        if (metric) {
          const [value, value_extended] = data.value.split('/');
          if (value_extended) {
            data_for_chart
              .find((d) => d.name == metric.title)!
              .data.push({
                timestamp: DateTime.fromISO(new Date(record.visit_doctor_date).toISOString()),
                value: Number(value_extended),
              });
          }
          data_for_chart
            .find((d) => d.name == metric.title)!
            .data.push({
              timestamp: DateTime.fromISO(new Date(record.visit_doctor_date).toISOString()),
              value: Number(value),
            });
        }
      });
    });
    return data_for_chart;
  }

  multi_data = this.getRecordDataForChart();
  protected recordsData = signal<RecordResponse[]>([]);
  protected metrics: MetricResponseType[];

  constructor(private _trackingService: PregnancyTrackingService) {
    this.initChartOptions();
    this._trackingService.RecordData.subscribe((data) => {
      this.recordsData = data;
    });
    this._trackingService.getMetrics().subscribe((data) => {
      this.metrics = data.filter((m) => m.status != Status.INACTIVE);
    });
  }

  ngOnInit() {
    this.updateChartData();
  }

  initChartOptions() {
    this.chartOptions = {
      series: [],
      colors: ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: 'inherit',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: function (val) {
            return DateTime.fromMillis(Number(val)).toFormat('MMM dd');
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val?.toFixed(0);
          },
        },
        tickAmount: 5,
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
        },
        y: {
          formatter: function (val) {
            return val?.toFixed(0);
          },
        },
        theme: 'light',
        shared: true,
        intersect: false,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -10,
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10,
        },
      },
    };
  }

  updateChartData() {
    if (!this.multi_data) {
      return;
    }

    // Calculate date range based on selected period
    const startDate = this.getStartDateFromPeriod();

    // Filter data based on selected period
    this.chartOptions.series = this.multi_data.map((series) => ({
      name: series.name,
      data: series.data
        .filter((d) => d.timestamp >= startDate)
        .map((d) => ({
          x: d.timestamp.toJSDate(),
          y: d.value,
        })),
    }));
  }

  getStartDateFromPeriod(): DateTime {
    const now = DateTime.now();
    const period = this.periods.find((p) => p.label === this.selectedPeriod);
    return now.minus({ days: period ? period.days : 30 });
  }

  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.updateChartData();
  }

  calculatePercentageChange(seriesIndex: number): { value: string; isPositive: boolean } {
    if (!this.multi_data || !this.multi_data[seriesIndex] || this.multi_data[seriesIndex].data.length < 2) {
      return { value: '0', isPositive: true };
    }

    const data = this.multi_data[seriesIndex].data;
    const currentValue = data[data.length - 1].value;
    const previousValue = data[data.length - 2].value;

    if (previousValue === 0) return { value: '0', isPositive: true };

    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
    };
  }
}

interface RecordDataForChart {
  name: string;
  data: { timestamp: DateTime; value: number }[];
}
