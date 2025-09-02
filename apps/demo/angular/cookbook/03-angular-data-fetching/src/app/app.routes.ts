import { Routes } from '@angular/router';
import { FetchComponent } from './components/fetch.component';
import { ResourceComponent } from './components/resource.component';
import { RxResourceComponent } from './components/rx-resource.component';
import { RxTanstackComponent } from './components/rx-tanstack.component';
import { TanstackComponent } from './components/tanstack.component';

export const routes: Routes = [
  {
    path: '',
    component: FetchComponent,
  },
  {
    path: 'resource',
    component: ResourceComponent,
  },
  {
    path: 'rx-resource',
    component: RxResourceComponent,
  },
  {
    path: 'rx-tanstack',
    component: RxTanstackComponent,
  },
  {
    path: 'tanstack',
    component: TanstackComponent,
  },
];
