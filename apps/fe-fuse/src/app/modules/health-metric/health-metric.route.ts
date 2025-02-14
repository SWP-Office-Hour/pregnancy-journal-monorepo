import { Routes } from '@angular/router';
import { HealthMetricTableComponent } from './health-metric-table/health-metric-table.component';
import { HealthMetricComponent } from './health-metric.component';

export default [
  {
    path: '',
    component: HealthMetricComponent,
    children: [
      {
        path: '/table',
        component: HealthMetricTableComponent,
        // resolve: {
        //   brands: () => inject(InventoryService).getBrands(),
        //   categories: () => inject(InventoryService).getCategories(),
        //   products: () => inject(InventoryService).getProducts(),
        //   tags: () => inject(InventoryService).getTags(),
        //   vendors: () => inject(InventoryService).getVendors(),
        // },
      },
    ],
  },
] as Routes;
