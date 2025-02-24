import { Route } from '@angular/router';
import { CreatePostComponent } from './create-post/create-post.component';

export const postRoutes: Route[] = [
  {
    path: 'create',
    loadComponent: () => CreatePostComponent,
  },
];
