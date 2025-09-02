import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserService } from './services/user.service';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  template: `
    <main>
      <h1>Fetch Users</h1>
      <ul>
        <li><a routerLink="/">Resource with Fetch</a></li>
        <li><a routerLink="/resource">Resource with promise</a></li>
        <li><a routerLink="/rx-resource">Rx Resource</a></li>
        <li><a routerLink="/tanstack">Tanstack with Fetch</a></li>
        <li><a routerLink="/rx-tanstack">Rx Tanstack</a></li>
      </ul>
      <router-outlet />
    </main>
  `,
})
export class App {
  protected readonly userService = inject(UserService);
}
