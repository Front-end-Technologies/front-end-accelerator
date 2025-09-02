import { Routes } from '@angular/router';

import { FetchComponent } from './components/fetch.component';
import { ResourceComponent } from './components/resource.component';
import { RxResourceComponent } from './components/rx-resource.component';
import { RxTanstackComponent } from './components/rx-tanstack.component';
import { TanstackComponent } from './components/tanstack.component';

export const routes: Routes = [
  {
    component: FetchComponent,
    path: '',
  },
  {
    component: ResourceComponent,
    path: 'resource',
  },
  {
    component: RxResourceComponent,
    path: 'rx-resource',
  },
  {
    component: RxTanstackComponent,
    path: 'rx-tanstack',
  },
  {
    component: TanstackComponent,
    path: 'tanstack',
  },
];
