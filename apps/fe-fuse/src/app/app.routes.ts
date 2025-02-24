import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { FormComponent } from './common/form/form.component';
import { AdminAuthGuard } from './core/auth/guards/adminAuth.guard';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { PregnancyRecordComponent } from './modules/customer/pregnancy-record/pregnancy-record.component';
import { pregnancyTrackingRoutes } from './modules/customer/pregnancy-tracking/pregnancy-tracking.routes';
import { LandingComponent } from './modules/landing/landing.component';
import { HomeComponent } from './modules/member/home/home.component';
import { postRoutes } from './modules/post/post.routes';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  // Redirect empty path to '/landing'
  { path: '', pathMatch: 'full', redirectTo: 'landing' },

  // Redirect signed-in user to the '/home'
  //
  // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },
  //signed in redirect to homepage (default)

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes'),
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes'),
      },
      { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
      { path: 'sign-in-with-google', loadChildren: () => import('app/modules/auth/sign-in-with-google/sign-in-with-google.routes') },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [{ path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') }],
  },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    resolve: {
      initialData: initialDataResolver,
    },
    children: [{ path: 'landing', loadComponent: () => LandingComponent }],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'admin',
    },
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: 'admin',
        loadChildren: () => import('app/modules/admin/admin.routes'),
      },
    ],
  },

  // Customer routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      { path: 'home', loadComponent: () => HomeComponent },
      { path: 'tracking', loadChildren: () => pregnancyTrackingRoutes },
      {
        path: 'record',
        loadComponent: () => PregnancyRecordComponent,
      },
      {
        path: 'calendar',
        loadComponent: () => CalendarComponent,
      },
      {
        path: 'post',
        loadChildren: () => postRoutes,
      },
      {
        path: 'user-profile',
        loadComponent: () => UserProfileComponent,
      },
      {
        path: 'form',
        data: {
          selectInput: [
            {
              label: 'Select',
              value: '1',
              name: 'select',
              options: [
                {
                  value: '1',
                  title: 'Java',
                },
                {
                  value: '2',
                  title: 'JavaScript',
                },
                {
                  value: '3',
                  title: 'TypeScript',
                },
              ],
              required: true,
            },
          ],
          numberInput: [
            {
              label: 'Number',
              value: 1,
              name: 'number',
              placeholder: 'Number',
              pattern: '^[0-9]*$',
              required: true,
            },
          ],
          textInput: [
            {
              label: 'Text',
              value: 'Super duper form',
              name: 'text',
              placeholder: 'Text',
              pattern: '^[a-zA-Z]*$',
              required: true,
            },
            {
              label: 'Text',
              value: 'Super duper form 2',
              name: 'text',
              placeholder: 'Text',
              pattern: '^[a-zA-Z]*$',
              required: true,
            },
          ],
          dateInput: [
            {
              label: 'Date',
              name: 'date',
              value: new Date(),
              required: true,
            },
          ],
          submitText: 'Chốt',
        },
        loadComponent: () => FormComponent,
      },
    ],
  },

  {
    path: '404-not-found',
    loadChildren: () => import('app/modules/pages/pages.routes'),
  },
  { path: '**', redirectTo: '404-not-found' },
];
