import { Component, computed, effect, resource, signal } from '@angular/core';
import { Standard } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { environment } from '../../../../../environments/environment';
import { SignalPregnancyTrackingService } from '../signal-pregnancy-tracking.service';

@Component({
  selector: 'app-record-chart',
  imports: [TabsModule],
  templateUrl: './record-chart.component.html',
  styleUrl: './record-chart.component.css',
})
export class RecordChartComponent {
  flag = signal(false);
  // Component state
  isLoading = false;

  metricArrayCurrentlyInRecordOfChild = computed(() => {
    const tmp = this.getUniqueMetricIds(this.signalPregnancyTrackingService.recordResourceOfSelectedChild.value());
    return tmp || [];
  });

  standardResourceOfUniqueMetric = resource<Standard[], {}>({
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
          console.log('promiseArr', promiseArr);
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
    private signalPregnancyTrackingService: SignalPregnancyTrackingService,
  ) {
    effect(() => {
      console.log('metricArrayCurrentlyInRecordOfChild', this.metricArrayCurrentlyInRecordOfChild());
      console.log('standardResourceOfUniqueMetric', this.standardResourceOfUniqueMetric.value());
      if (this.metricArrayCurrentlyInRecordOfChild().length > 0) {
        this.flag.set(true);
      }
      console.log('flag', this.flag());
    });
  }

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
