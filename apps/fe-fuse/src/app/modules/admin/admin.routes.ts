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
    // component: BlogComponent, trang chính của blog, có mấy cái nút để bấm tiếp qua các chức năng
    children: [
      {
        path: 'create',
        component: CreateBlogComponent,
      },
    ],
  },
] as Routes;
