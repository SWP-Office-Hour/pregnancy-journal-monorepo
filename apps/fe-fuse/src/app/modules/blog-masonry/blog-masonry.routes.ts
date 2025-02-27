import { Route } from '@angular/router';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogMasonryComponent } from './blog-masonry.component';

export const blogMasonryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => BlogMasonryComponent,
  },
  {
    path: ':id',
    loadComponent: () => BlogDetailComponent,
  },
];
