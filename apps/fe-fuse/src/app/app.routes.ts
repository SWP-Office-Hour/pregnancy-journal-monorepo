import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { initialDataResolver, landingDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AdminAuthGuard } from './core/auth/guards/adminAuth.guard';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { blogAuthGuard, blogNoAuthGuard } from './modules/blog-masonry/blog-auth.guard';
import { blogMasonryRoutes } from './modules/blog-masonry/blog-masonry.routes';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { CalendarService } from './modules/calendar/calendar.service';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { ChildrenProfileComponent } from './modules/children-profile/children-profile.component';
import { PregnancyRecordViewComponent } from './modules/customer/pregnancy-record-view/pregnancy-record-view.component';
import { pregnancyRecordRoutes } from './modules/customer/pregnancy-record/pregnancy-record.routes';
import { pregnancyTrackingRoutes } from './modules/customer/pregnancy-tracking/pregnancy-tracking.routes';
import { FeaturesComponent } from './modules/features/features.component';
import { LandingComponent } from './modules/landing/landing.component';
import { HomeComponent } from './modules/member/home/home.component';
import { MembershipDetailComponent } from './modules/membership-detail/membership-detail.component';
import { MembershipComponent } from './modules/membership/membership.component';
import { PaymentLandingComponent } from './modules/payment-landing/payment-landing.component';
import { PaymentComponent } from './modules/payment/payment.component';
import { postRoutes } from './modules/post/post.routes';
import { UserProfileComponent } from './modules/profile/user-profile.component';

export const wrapperRoute: Route[] = [{ path: '', loadChildren: () => appRoutes }];

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
      layout: 'auth',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes'),
      },
      {
        path: 'forgot-password',
        loadComponent: () => ForgotPasswordComponent,
      },
      { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
      {
        data: {
          layout: 'nothing',
        },
        path: 'sign-in-with-google',
        loadChildren: () => import('app/modules/auth/sign-in-with-google/sign-in-with-google.routes'),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'nothing',
    },
    children: [{ path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') }],
  },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'landing',
    },
    resolve: {
      initialData: landingDataResolver,
    },
    children: [
      { path: 'landing', loadComponent: () => LandingComponent },
      {
        path: 'about',
        redirectTo: 'landing',
      },
      {
        path: 'features',
        loadComponent: () => FeaturesComponent,
      },
      {
        path: 'blog',
        canActivate: [blogNoAuthGuard],
        loadChildren: () => blogMasonryRoutes,
      },
    ],
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

  // {
  //   path: 'authenticated/blog',
  //   component: LayoutComponent,
  //   canActivate: [blogAuthGuard],
  //   resolve: {
  //     initialData: initialDataResolver,
  //   },
  //   loadChildren: () => blogMasonryRoutes,
  // },

  // Customer routes
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          { path: 'home', loadComponent: () => HomeComponent },
          { path: 'tracking', loadChildren: () => pregnancyTrackingRoutes },
          {
            path: 'record',
            loadChildren: () => pregnancyRecordRoutes,
          },
          {
            path: 'calendar',
            resolve: () => {
              const _calendarService = inject(CalendarService);

              _calendarService.reloadMeetings();
            },
            loadComponent: () => CalendarComponent,
          },
          {
            path: 'community',
            loadChildren: () => postRoutes,
          },
          {
            path: 'membership',
            // loadChildren: () => membershipsRoute, CHƯA CODE của CUSTOMER
            loadComponent: () => MembershipComponent,
          },
          {
            path: 'membership/:id',
            loadComponent: () => MembershipDetailComponent,
          },
          {
            path: 'user-profile',
            loadComponent: () => UserProfileComponent,
          },
          {
            path: 'children-profile',
            loadComponent: () => ChildrenProfileComponent,
          },
          {
            path: 'change-password',
            loadComponent: () => ChangePasswordComponent,
          },
          {
            path: 'payment',
            loadComponent: () => PaymentComponent,
          },
          {
            path: 'payment-landing',
            loadComponent: () => PaymentLandingComponent,
          },
        ],
      },
      {
        path: 'authenticated/blog',
        canActivate: [blogAuthGuard],
        loadChildren: () => blogMasonryRoutes,
      },
    ],
  },
  {
    path: 'record-view',
    component: LayoutComponent,
    data: {
      layout: 'landing',
    },
    children: [
      {
        path: '',
        loadComponent: () => PregnancyRecordViewComponent,
      },
    ],
  },

  {
    path: '404-not-found',
    data: {
      layout: 'landing',
    },
    loadChildren: () => import('app/modules/pages/pages.routes'),
  },
  { path: '**', redirectTo: '404-not-found' },
];
