import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AdminAuthGuard } from './core/auth/guards/adminAuth.guard';
import { PregnancyRecordComponent } from './modules/customer/pregnancy-record/pregnancy-record.component';
import { pregnancyTrackingRoutes } from './modules/customer/pregnancy-tracking/pregnancy-tracking.routes';
import { LandingComponent } from './modules/landing/landing.component';
import { HomeComponent } from './modules/member/home/home.component';

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
    children: [
      { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
      { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') },
    ],
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
    ],
  },

  {
    path: '404-not-found',
    loadChildren: () => import('app/modules/pages/pages.routes'),
  },
  { path: '**', redirectTo: '404-not-found' },
];
