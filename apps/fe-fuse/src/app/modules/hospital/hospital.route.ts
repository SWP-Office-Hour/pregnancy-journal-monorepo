import { Routes } from '@angular/router';
import { HospitalTableComponent } from './hospital-table/hospital-table.component';

export default [
  {
    path: '',
    component: HospitalTableComponent,
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
