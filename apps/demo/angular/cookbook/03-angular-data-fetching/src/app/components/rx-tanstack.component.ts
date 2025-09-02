import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  imports: [CommonModule],
  selector: 'app-tanstack',
  template: `
    <div>
      <h3>Rx Tanstack to Promise</h3>

      <p>Note that the Tanstack queries are being cached</p>

      @if (usersQuery.data()) {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            @for (user of usersQuery.data()?.users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.phone }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class RxTanstackComponent {
  protected readonly userService = inject(UserService);

  usersQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.userService.getUsersPromise(),
  }));
}
