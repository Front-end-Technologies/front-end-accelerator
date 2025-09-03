import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './pages/dashboard.component';
import { UserDetailComponent } from './pages/user.component';

export const routes: Routes = [
  {
    loadComponent: () =>
      import('./pages/about.component').then((m) => m.AboutComponent),
    path: 'about',
  },
  {
    canActivate: [authGuard],
    children: [{ component: UserDetailComponent, path: 'user/:id' }],
    component: DashboardComponent,
    path: 'dashboard',
  },
];
