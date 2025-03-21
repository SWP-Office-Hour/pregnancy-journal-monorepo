import { effect, Injectable, resource, signal } from '@angular/core';
import { ChildType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalPregnancyTrackingService {
  globalSelectedChild = signal<ChildType>({} as ChildType);

  // Component state
  isLoadingGlobal = false;
  currentChildId = signal('');

  recordResourceOfSelectedChild = resource<RecordResponse, undefined | {}>({
    request: () => {
      if (this.currentChildId() == '') {
        return undefined;
      } else {
        return { id: this.currentChildId() };
      }
    },
    loader: async ({ abortSignal }) => {
      this.isLoadingGlobal = true;
      try {
        const response = await fetch(`${environment.apiUrl}record`, {
          signal: abortSignal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            Child_id: this.currentChildId(),
          },
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        this.notifyError(error);
        console.error('Error fetching metrics:', error);
        return [];
      } finally {
        this.isLoadingGlobal = false;
      }
    },
  });

  constructor(private messageService: MessageService) {
    effect(() => {
      if (this.globalSelectedChild() != undefined) {
        this.currentChildId.set(this.globalSelectedChild().child_id);
      }
    });
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
