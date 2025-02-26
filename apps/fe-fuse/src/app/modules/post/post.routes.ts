import { Route } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { CreatePostComponent } from './create-post/create-post.component';

export const postRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => CommunityComponent,
  },
  {
    path: 'create',
    loadComponent: () => CreatePostComponent,
  },
];
