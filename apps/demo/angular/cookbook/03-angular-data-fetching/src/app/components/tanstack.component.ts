import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { UsersResponse } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Component({
  imports: [CommonModule],
  selector: 'app-tanstack',
  template: `
    <div>
      <h3>Tanstack with Fetch</h3>

      <p>Note that the Tanstack queries are being cached</p>

      @if (usersQuery.data()) {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mac Address</th>
            </tr>
          </thead>
          <tbody>
            @for (user of usersQuery.data()?.users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.macAddress }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class TanstackComponent {
  protected readonly userService = inject(UserService);

  usersQuery = injectQuery(() => ({
    queryFn: async () => {
      const res = await this.userService.fetchUsers();
      return (await res.json()) as UsersResponse;
    },
    queryKey: ['users'],
  }));
}
