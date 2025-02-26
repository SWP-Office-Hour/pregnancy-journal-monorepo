import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { project as projectData } from 'app/mock-api/common/dashboards/project/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AdminMockApi {
  private _project: any = projectData;

  /**
   * Constructora
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Sales - GET
    // -----------------------------------------------------------------------------------------------------
    console.log('gọi hàm get data dashboard');
    this._fuseMockApiService.onGet('api/dashboard/admin').reply(() => [200, cloneDeep(this._project)]);
  }
}
