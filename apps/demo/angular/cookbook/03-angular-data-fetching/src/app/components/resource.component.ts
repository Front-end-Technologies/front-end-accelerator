import { Component, inject, resource } from '@angular/core';
import { UserService } from '../services/user.service';
import { UsersResponse } from '../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-resource',
  template: `
    <div>
      <h3>Resource with promise</h3>

      @if (userResource.hasValue()) {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            @for (user of userResource.value().users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.age }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class ResourceComponent {
  protected readonly userService = inject(UserService);

  userResource = resource({
    loader: () => this.userService.getUsersPromise(),
  });
}
