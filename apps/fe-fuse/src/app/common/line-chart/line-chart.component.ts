import { CommonModule } from '@angular/common';
import { Component, OnInit, resource, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MetricResponseType, MetricWithStandardResponseType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
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
import { TabsModule } from 'primeng/tabs';
import { environment } from '../../../environments/environment';
import { ChildV2Service } from '../../core/children/child.v2.service';
import { PregnancyTrackingV2Service } from '../../modules/customer/pregnancy-tracking/pregnancy-tracking-v2.service';

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
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, CommonModule, TabsModule, ChartComponent],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  child_id: string;
  selectedPeriod: string = '30 days';
  periods = [
    { label: '30 days', days: 30 },
    { label: '3 months', days: 90 },
    { label: '9 months', days: 270 },
  ];

  title: string = 'Theo dõi chỉ số';
  metrics = signal<MetricResponseType[]>([]);
  selectedMetric = signal<string>('');
  metricIdArrayResource = resource<string[], []>({
    loader: async ({ abortSignal }) => {
      const record: { total: number; data: RecordResponse[] } = await fetch(environment.apiUrl + 'record', {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          child_id: this.child_id,
        },
      }).then((res) => res.json());

      const metricIds: string[] = [];
      record.data.forEach((r) => {
        r.data.forEach((d) => {
          if (!metricIds.includes(d.metric_id)) {
            metricIds.push(d.metric_id);
          }
        });
      });
      console.log('metricIds', metricIds);
      return metricIds;
    },
  });

  multi_data = resource<
    {
      name: string;
      data: { week: number; value: number }[];
    }[],
    []
  >({
    loader: async ({ abortSignal }) => {
      const metricId = this.selectedMetric();
      const userValue: {
        name: string;
        data: { week: number; value: number }[];
      } = {
        name: 'Chỉ số của bạn',
        data: this._trackingService.records.value().map((record) => {
          const data = record.data.find((value) => value.metric_id === metricId);
          return {
            week: record.week,
            value: data ? Number(data.value) : 0,
          };
        }),
      };

      const metricWithStandards: MetricWithStandardResponseType = await fetch(environment.apiUrl + 'metrics/' + metricId, {
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then((res) => res.json());

      const standardValue: {
        name: string;
        data: { week: number; value: number }[];
      } = {
        name: 'Chỉ số chuẩn',
        data: metricWithStandards.standardArray.map((standard) => {
          return {
            week: standard.week,
            value: standard.who_standard_value,
          };
        }),
      };

      const series = [standardValue, userValue];
      this.chartOptions.series = series.map((s) => ({
        name: s.name,
        data: s.data.map((d) => ({
          x: d.week,
          y: d.value,
        })),
      }));

      return series;
    },
  });

  constructor(
    private _trackingService: PregnancyTrackingV2Service,
    private _childService: ChildV2Service,
  ) {
    this.metrics = this._trackingService.metrics.value;
    this._childService.child$.subscribe((child) => {
      this.child_id = child.child_id;
    });
    this.initChartOptions();
  }

  getMetricTitle(metricId: string): string {
    const metric = this.metrics().find((metric) => metric.metric_id === metricId);
    return metric ? metric.title : '';
  }

  changeMetric(metricId: string) {
    console.log('changeMetric', metricId);
    this.selectedMetric.set(metricId);
    this.multi_data.reload();
  }

  ngOnInit() {
    // this.updateChartData();
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
        type: 'numeric',
        labels: {
          formatter: function (val) {
            return `Tuần ${val}`;
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
    console.log('updateChartData', this.multi_data.value());
    if (!this.multi_data.value() || this.multi_data.value().length === 0) {
      return;
    }

    // Filter data based on selected period
    this.chartOptions.series = this.multi_data.value().map((series) => ({
      name: series.name,
      data: series.data.map((d) => ({
        x: d.week,
        y: d.value,
      })),
    }));

    console.log(this.chartOptions.series);
  }

  getStartWeekFromPeriod(): number {
    const now = DateTime.now();
    const period = this.periods.find((p) => p.label === this.selectedPeriod);
    return now.minus({ days: period ? period.days : 30 }).weekNumber;
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
