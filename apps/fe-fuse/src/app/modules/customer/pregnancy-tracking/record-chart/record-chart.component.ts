import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, inject, OnInit, PLATFORM_ID, resource, signal } from '@angular/core';
import { MetricResponseType, Standard } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { TabsModule } from 'primeng/tabs';
import { environment } from '../../../../../environments/environment';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';
import { SignalPregnancyTrackingService } from '../signal-pregnancy-tracking.service';
@Component({
  selector: 'app-record-chart',
  imports: [TabsModule, ChartModule],
  templateUrl: './record-chart.component.html',
  styleUrl: './record-chart.component.css',
})
export class RecordChartComponent implements OnInit {
  platformId = inject(PLATFORM_ID);

  flag = signal(false);
  // Component state
  isLoading = false;
  metrics = resource<MetricResponseType[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}metrics`, {
          signal: abortSignal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }
        const metrics: MetricResponseType[] = await response.json();
        return metrics;
      } catch (error) {
        this.notifyError(error);
        console.error('Error fetching metrics:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  });

  metricArrayCurrentlyInRecordOfChild = computed(() => {
    const tmp = this.getUniqueMetricIds(this.signalPregnancyTrackingService.recordResourceOfSelectedChild.value());
    return tmp || [];
  });

  standardResourceOfUniqueMetric = resource<Standard[][], {}>({
    request: () => ({ fl: this.flag() }),
    loader: async ({ abortSignal }) => {
      // loading true
      let totalResArr = [];
      let promiseArr = [];
      try {
        this.metricArrayCurrentlyInRecordOfChild().forEach((metricId: any) => {
          const promiseMetric = async () => {
            const response = await fetch(`${environment.apiUrl}standards/${metricId}`, {
              signal: abortSignal,
              method: 'GET',
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch metrics: ${response.status}`);
            }
            return await response.json();
          };
          promiseArr.push(promiseMetric());
        });
        return Promise.all(promiseArr);
      } catch (error) {
        this.notifyError(error);
        console.error('Error fetching metrics:', error);
        return [];
      } finally {
        //loading false
      }
    },
  });

  constructor(
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private signalPregnancyTrackingService: SignalPregnancyTrackingService,
    private apiPregnancyTrackingService: PregnancyTrackingService,
  ) {
    effect(() => {
      if (this.metricArrayCurrentlyInRecordOfChild().length > 0) {
        this.flag.set(true);
      }
      console.log('Hưng đa');
    });
  }

  ngOnInit() {
    this.initChart();
  }

  basicOptions: any;

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      // this.basicData = {
      //   labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      //   datasets: [
      //     {
      //       label: 'Sales',
      //       data: [540, 325, 702, 620],
      //       backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
      //       borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
      //       borderWidth: 1,
      //     },
      //   ],
      // };

      this.basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        spanGaps: false,
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  // options = {
  //   spanGaps: false,
  //   scales: {
  //     y: {
  //       beginAtZero: false,
  //     },
  //   },
  // };

  /**
   * LÀM ơn đưa RESOURCE resource chứ ko phải Record
   */
  getUniqueMetricIds(resourceRecord: any): any {
    if (resourceRecord === undefined) {
      return [];
    }
    //ts-ignore
    const records = resourceRecord.data || [];
    // Use a Set to automatically handle duplicates
    const metricIdsSet = new Set();

    // Iterate through each record
    records.forEach((record) => {
      // Iterate through the data array in each record
      if (record.data && Array.isArray(record.data)) {
        record.data.forEach((item) => {
          // Add non-null standard_ids to the Set
          if (item.metric_id !== null) {
            metricIdsSet.add(item.metric_id);
          }
        });
      }
    });

    // Convert Set back to Array
    //ts-ignore
    return Array.from(metricIdsSet);
  }

  getMetricTitle(metricId: string): string {
    const metric = this.metrics.value().find((metric) => metric.metric_id === metricId);
    return metric ? metric.title : '';
  }

  sortStandardByWeek(standards: Standard[]): Standard[] {
    return standards.sort((a, b) => {
      return a.week - b.week;
    });
  }

  click(content?: any) {
    console.log('click');
    console.log('content: ', content);
  }

  getChartData(metricId: string, standards: Standard[]) {
    const totalWeeks = Array.from({ length: 42 }, (_, i) => i + 1);
    const metricValues = Array(42).fill(null);
    const standardValues = Array(42).fill(null);

    const recordData = this.apiPregnancyTrackingService.getRecordDataByMetricId(metricId);
    const standardData = standards.map((standard) => {
      return {
        week: standard.week,
        value: standard.who_standard_value,
      };
    });

    recordData.forEach((item) => {
      metricValues[item.week - 1] = item.value == 0 ? null : item.value;
    });

    standardData.forEach((item) => {
      standardValues[item.week - 1] = item.value;
    });
    return {
      labels: totalWeeks,
      datasets: [
        {
          label: 'Giá trị',
          data: metricValues,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Giá trị chuẩn',
          data: standardValues,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };
  }

  private notifyError(error: any): void {
    console.error('Error in HealthMetricTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}

interface MetricTabType {}
