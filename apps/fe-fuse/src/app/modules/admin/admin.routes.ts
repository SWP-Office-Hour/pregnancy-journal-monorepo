import { Routes } from '@angular/router';
import { BlogRoutes } from '../blog/blog.routes';
import { HealthMetricComponent } from '../health-metric/health-metric.component';
import { AdminComponent } from './admin.component';

export default [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'health-metric',
    component: HealthMetricComponent,
  },
  {
    path: 'blogs',
    loadChildren: () => BlogRoutes,
  },
] as Routes;
