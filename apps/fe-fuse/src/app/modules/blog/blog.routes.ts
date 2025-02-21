// import { inject } from '@angular/core';
// import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
// import { catchError, throwError } from 'rxjs';
//
// /**
//  * Course resolver
//  *
//  * @param route
//  * @param state
//  */
// const blogResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   // const academyService = inject(AcademyService);
//   const router = inject(Router);
//
//   return academyService.getCourseById(route.paramMap.get('id')).pipe(
//     // Error here means the requested course is not available
//     catchError((error) => {
//       // Log the error
//       console.error(error);
//
//       // Get the parent url
//       const parentUrl = state.url.split('/').slice(0, -1).join('/');
//
//       // Navigate to there
//       router.navigateByUrl(parentUrl);
//
//       // Throw an error
//       return throwError(error);
//     }),
//   );
// };
//
// export default [
//   {
//     path: '',
//     component: AcademyComponent,
//     resolve: {
//       categories: () => inject(AcademyService).getCategories(),
//     },
//     children: [
//       {
//         path: '',
//         pathMatch: 'full',
//         component: AcademyListComponent,
//         resolve: {
//           courses: () => inject(AcademyService).getCourses(),
//         },
//       },
//       {
//         path: ':id',
//         component: AcademyDetailsComponent,
//         resolve: {
//           course: blogResolver,
//         },
//       },
//     ],
//   },
// ] as Routes;

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { BlogComponent } from './blog.component';
import { BlogsService } from './blogs.service';
import { BlogEditorComponent } from './create-blog/blog-editor.component';

const blogResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const blogsService = inject(BlogsService);
  const router = inject(Router);

  return blogsService.getBlogById(route.paramMap.get('id')!).pipe(
    // Error here means the requested course is not available
    catchError((error) => {
      // Log the error
      console.error(error);

      // Get the parent url
      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      // Navigate to there
      router.navigateByUrl(parentUrl).then();

      // Throw an error
      return throwError(() => new Error('Blog not found'));
    }),
  );
};

export const BlogRoutes = [
  {
    path: '',
    component: BlogComponent,
  },
  {
    path: 'create',
    component: BlogEditorComponent,
  },
  {
    path: ':id',
    component: BlogEditorComponent,
    resolve: {
      blog: blogResolver,
    },
  },
];
