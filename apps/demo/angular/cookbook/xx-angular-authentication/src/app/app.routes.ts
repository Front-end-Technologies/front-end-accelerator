import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationExampleComponent } from './security/microsoft/authentication-example.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'auth-example',
    component: AuthenticationExampleComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
