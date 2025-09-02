import { CommonModule } from '@angular/common';
import { Component, inject, resource } from '@angular/core';

import { UsersResponse } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  imports: [CommonModule],
  selector: 'app-fetch',
  template: `
    <div>
      <h3>Resource with Fetch</h3>

      @if (userResourceWithFetch.hasValue()) {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            @for (user of userResourceWithFetch.value().users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.email }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class FetchComponent {
  protected readonly userService = inject(UserService);

  userResourceWithFetch = resource({
    loader: async () => {
      const response = await this.userService.fetchUsers();
      return (await response.json()) as UsersResponse;
    },
  });
}
