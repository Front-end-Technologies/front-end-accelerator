import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './pages/dashboard.component';
import { NoAccessComponent } from './pages/no-access.component';
import { UserDetailComponent } from './pages/user.component';

export const routes: Routes = [
  {
    loadComponent: () =>
      import('./pages/about.component').then((m) => m.AboutComponent),
    path: 'about',
  },
  {
    canActivate: [authGuard],
    children: [
      {
        canActivate: [authGuard],
        component: UserDetailComponent,
        path: 'user/:id',
      },
    ],
    component: DashboardComponent,
    path: 'dashboard',
  },
  {
    component: NoAccessComponent,
    path: 'no-access',
  },
];
