import { Routes } from '@angular/router';
import { HeaderComponentComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaigaDashboardComponent } from './dashboard/taiga-dashboard/taiga-dashboard.component';
import { LoginComponent } from './login/login.component';
import { PregnancyTrackingComponent } from './pregnancy-tracking/pregnancy-tracking.component';
import { SignupComponentComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pregnancy-tracking', component: PregnancyTrackingComponent },
  { path: 'example-taiga-dashboard', component: TaigaDashboardComponent },
  { path: 'header', component: HeaderComponentComponent },
];
