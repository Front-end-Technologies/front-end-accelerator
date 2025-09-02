import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { UserService } from '../services/user.service';

@Component({
  imports: [CommonModule],
  selector: 'app-rx-resource',
  template: `
    <div>
      <h3>RxResource</h3>

      @if (userRxResource.hasValue()) {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            @for (user of userRxResource.value().users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.gender }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class RxResourceComponent {
  protected readonly userService = inject(UserService);

  userRxResource = rxResource({
    stream: () => this.userService.getUsersRx(),
  });
}
