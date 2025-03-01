import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { BlogRoutes } from './blog/blog.routes';
import { CategoryTableComponent } from './category-table/category-table.component';
import { HealthMetricTableComponent } from './health-metric-table/health-metric-table.component';
import { HospitalTableComponent } from './hospital-table/hospital-table.component';
import { MembershipTableComponent } from './membership-table/membership-table.component';
import { TagTableComponent } from './tag-table/tag-table.component';
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
        loadComponent: () => HealthMetricTableComponent,
      },
    ],
  },
  {
    path: 'tag',
    children: [
      {
        path: '',
        loadComponent: () => TagTableComponent,
      },
    ],
  },
  {
    path: 'hospital',
    children: [
      {
        path: '',
        loadComponent: () => HospitalTableComponent,
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
        loadComponent: () => CategoryTableComponent,
      },
    ],
  },
  {
    path: 'membership',
    children: [
      {
        path: '',
        loadComponent: () => MembershipTableComponent,
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
