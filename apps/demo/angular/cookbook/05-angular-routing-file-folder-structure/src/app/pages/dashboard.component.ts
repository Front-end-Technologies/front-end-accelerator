import { Component, computed, inject, resource } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  imports: [RouterModule],
  selector: 'app-dashboard',
  template: `
    <h2>Dashboard</h2>
    <h3>Protected route</h3>
    <p>
      This route has an auth guard that checks with an authenticated request to
      see if you have access
    </p>

    <h3>Resource with promise</h3>

    @if (limitedResults()) {
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (user of limitedResults(); track user.id) {
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.age }}</td>
              <td><a [routerLink]="['user', user.id]"> open </a></td>
            </tr>
          }
        </tbody>
      </table>
    }

    <hr />
    <router-outlet />
  `,
})
export class DashboardComponent {
  userService = inject(UserService);

  userResource = resource({
    loader: () => this.userService.getUsers(),
  });

  limitedResults = computed(() => {
    const users = this.userResource.value()?.users;
    return users ? users.slice(0, 5) : [];
  });
}
