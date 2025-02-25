import { Routes } from '@angular/router';
import { PricingModernComponent } from './membership-user/membership.component';

export const membershipsRoute = [
  {
    path: '',
    component: PricingModernComponent,
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
