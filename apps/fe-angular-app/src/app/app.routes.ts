import { Routes } from '@angular/router';
import { SignupComponentComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PregnancyTrackingComponent } from './pregnancy-tracking/pregnancy-tracking.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponentComponent } from './components/header/header.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pregnancy-tracking', component: PregnancyTrackingComponent },
  { path: 'header', component: HeaderComponentComponent },
];
