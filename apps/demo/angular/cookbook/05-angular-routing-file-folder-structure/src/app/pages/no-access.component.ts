import { Component } from '@angular/core';

@Component({
  selector: 'app-no-access',
  styles: [
    `
      .no-access-container {
        text-align: center;
        margin-top: 100px;
      }
      h1 {
        color: #d32f2f;
      }
    `,
  ],
  template: `
    <div class="no-access-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  `,
})
export class NoAccessComponent {}
