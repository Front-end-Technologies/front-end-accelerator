import { CommonModule } from '@angular/common';
import { Component, inject, input, resource } from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  imports: [CommonModule],
  selector: 'app-user-detail',
  template: `
    <h3>This is a child route of dashboard</h3>
    <pre>
  {{ userResource.value() | json }}
</pre>
  `,
})
export class UserDetailComponent {
  id = input.required<string>();
  userService = inject(UserService);

  userResource = resource({
    loader: ({ params }) => this.userService.getUser(params.id),
    params: () => ({ id: this.id() }),
  });
}
