import { Routes } from '@angular/router';
import { MembershipTableComponent } from './membership-table/membership-table.component';

export default [
  {
    path: '',
    component: MembershipTableComponent,
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
