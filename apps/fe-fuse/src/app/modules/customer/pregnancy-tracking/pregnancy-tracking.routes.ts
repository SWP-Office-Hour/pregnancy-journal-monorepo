import { Route } from '@angular/router';
import { memberAuthGuard } from '../../../core/auth/guards/member-auth.guard';
import { PregnancyTrackingComponent } from './pregnancy-tracking.component';

export const pregnancyTrackingRoutes: Route[] = [
  {
    path: '',
    canActivate: [memberAuthGuard],
    component: PregnancyTrackingComponent,
  },
];
