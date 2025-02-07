import { Route } from '@angular/router';
import { PregnancyTrackingComponent } from './pregnancy-tracking.component';

export const pregnancyTrackingRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'view/1',
  },
  {
    path: 'view/:id',
    component: PregnancyTrackingComponent,
  },
];
