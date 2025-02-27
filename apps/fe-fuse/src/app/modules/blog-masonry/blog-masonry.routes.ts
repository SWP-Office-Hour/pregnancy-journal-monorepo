import { Route } from '@angular/router';
import { BlogMasonryComponent } from './blog-masonry.component';

export const blogMasonryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => BlogMasonryComponent,
  },
];
