import { Component, effect, inject } from '@angular/core';
import { UserStore } from './signal-store.store';

@Component({
  selector: 'app-signal-store',
  template: `
    <h1>Signal Store Example</h1>
    <p>
      This is a simple example of using Angular Signals for state management.
    </p>
    @for (item of users(); track item.id) {
      <div>
        <h2>{{ item.firstName }} {{ item.lastName }}</h2>
        <p>Email: {{ item.email }}</p>
        <p>Age: {{ item.age }}</p>
        <p>Department: {{ item.department }}</p>
        <p>Active: {{ item.isActive ? 'Yes' : 'No' }}</p>
      </div>
    }
  `,
  providers: [UserStore],
})
export class SignalStoreComponent {
  readonly store = inject(UserStore);
  readonly users = this.store.users;
  constructor() {
    effect(() => {
      console.log('Users updated:', this.users());
    });
    effect(() => {
      console.log('Users count:', this.store.usersCount());
    });
    effect(() => {
      console.log('Loading state:', this.store.loading());
    });
  }
}
