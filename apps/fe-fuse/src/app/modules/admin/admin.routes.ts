import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';

export default [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'blogs',
    children: [
      {
        path: 'create',
        component: CreateBlogComponent,
      },
    ],
  },
] as Routes;
