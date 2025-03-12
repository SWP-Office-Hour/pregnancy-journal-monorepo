import { Route } from '@angular/router';
import { memberAuthGuard } from '../../../core/auth/guards/member-auth.guard';
import { PregnancyRecordComponent } from './pregnancy-record.component';

export const pregnancyRecordRoutes: Route[] = [
  {
    path: '',
    canActivate: [memberAuthGuard],
    component: PregnancyRecordComponent,
  },
];
