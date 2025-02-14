import { Routes } from '@angular/router';
import { BlogRoutes } from '../blog/blog.routes';
import { AdminComponent } from './admin.component';

export default [
  {
    path: '',
    component: AdminComponent,
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
    path: 'blog',
    loadChildren: () => BlogRoutes,
  },
] as Routes;
