import { Routes } from '@angular/router';
import { TagTableComponent } from './tag-table/tag-table.component';

export default [
  {
    path: '',
    component: TagTableComponent,
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
