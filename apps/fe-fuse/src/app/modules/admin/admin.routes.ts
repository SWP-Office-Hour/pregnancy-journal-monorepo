import { Routes } from '@angular/router';
import { BlogComponent } from '../blog/blog.component';
import { CreateBlogComponent } from '../blog/create-blog/create-blog.component';
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
    path: 'blog',
    component: BlogComponent,
    children: [
      {
        path: 'create',
        component: CreateBlogComponent,
      },
    ],
  },
] as Routes;
