import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { BlogRoutes } from '../blog/blog.routes';
import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { UserTableComponent } from './user-table/user-table.component';

export default [
  {
    path: '',
    component: AdminComponent,
    resolve: {
      data: () => inject(AdminService).getData(),
    },
  },
  {
    path: 'health-metric',
    children: [
      {
        path: '',
        loadChildren: () => import('app/modules/health-metric/health-metric.route'),
      },
    ],
  },
  {
    path: 'tag',
    children: [
      {
        path: '',
        loadChildren: () => import('app/modules/tag/tag.route'),
      },
    ],
  },
  {
    path: 'hospital',
    children: [
      {
        path: '',
        loadChildren: () => import('app/modules/hospital/hospital.route'),
      },
    ],
  },
  {
    path: 'blog',
    loadChildren: () => BlogRoutes,
  },
  {
    path: 'category',
    children: [
      {
        path: '',
        loadChildren: () => import('app/modules/category/category.route'),
      },
    ],
  },
  {
    path: 'membership',
    children: [
      {
        path: '',
        loadChildren: () => import('app/modules/membership/membership.route'),
      },
    ],
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () => UserTableComponent,
      },
    ],
  },
] as Routes;
