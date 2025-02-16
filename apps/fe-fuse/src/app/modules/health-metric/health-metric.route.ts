import { Routes } from '@angular/router';
import { HealthMetricTableComponent } from './health-metric-table/health-metric-table.component';

export default [
  {
    path: '',
    component: HealthMetricTableComponent,
    // children: [
    //   {
    //     path: '/table',
    //     component: ,
    //     // resolve: {
    //     //   brands: () => inject(InventoryService).getBrands(),
    //     //   categories: () => inject(InventoryService).getCategories(),
    //     //   products: () => inject(InventoryService).getProducts(),
    //     //   tags: () => inject(InventoryService).getTags(),
    //     //   vendors: () => inject(InventoryService).getVendors(),
    //     // },
    //   },
    // ],
  },
] as Routes;
