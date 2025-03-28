import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MetricResponseType } from '@pregnancy-journal-monorepo/contract';
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
import { ChildV2Service } from '../../core/children/child.v2.service';
import { PregnancyTrackingV2Service } from '../../modules/customer/pregnancy-tracking/pregnancy-tracking-v2.service';

export interface Series {
  name: string;
  data: { x: number; y: number }[];
}

@Component({
  selector: 'app-line-chart',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, CommonModule, TabsModule, ChartComponent],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit {
  child_id: string;
  title: string = 'Theo dõi chỉ số';
  metrics = signal<MetricResponseType[]>([]);
  selectedMetricId = signal<string>('');
  metricIdArrayResource: WritableSignal<{ options: LineChartOptions; metricId: string }[]>;
  protected readonly console = console;

  constructor(
    private _trackingService: PregnancyTrackingV2Service,
    private _childService: ChildV2Service,
  ) {
    this.metrics = this._trackingService.metrics.value;
    this._childService.child$.subscribe((child) => {
      this.child_id = child.child_id;
    });
    this.metricIdArrayResource = this._trackingService.metricDataArrayResource.value;
  }

  ngOnInit() {
    this.selectedMetricId.set(this.metrics()[0].metric_id);
  }

  getMetricTitle(metricId: string): string {
    const metric = this.metrics().find((metric) => metric.metric_id === metricId);
    return metric ? metric.title : '';
  }

  changeMetric(metricId: string) {
    console.log('changeMetric', metricId);
    this.selectedMetricId.set(metricId);
  }
}

export class LineChartOptions {
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

  constructor(series: Series[]) {
    this.series = series;
    this.colors = ['#4361ee', '#fa3e8d', '#7209b7', '#f72585', '#4cc9f0'];
    this.chart = {
      height: 350,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
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
    };
    this.dataLabels = {
      enabled: true,
    };
    this.stroke = {
      curve: 'smooth',
      width: 2,
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    };
    this.xaxis = {
      type: 'numeric',
      labels: {
        formatter: function (val) {
          return `Tuần ${Number(val).toFixed(0)}`;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return val?.toFixed(0);
        },
      },
      tickAmount: 5,
    };
    this.tooltip = {
      x: {
        formatter: function (val) {
          return `Tuần ${Number(val).toFixed(0)}`;
        },
      },
      y: {
        formatter: function (val) {
          return val?.toFixed(0);
        },
      },
      theme: 'light',
      shared: true,
      intersect: false,
    };
    this.legend = {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10,
    };
    this.grid = {
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
    };
  }
}
