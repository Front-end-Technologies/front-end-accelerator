import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <h1>Routing</h1>

    <p>This is a simple example of Angular routing.</p>

    <nav>
      <ul>
        <li><a routerLink="login">Login</a></li>
        <li><a routerLink="about">About</a></li>
        <li>
          <a routerLink="dashboard"
            >Dashboard (protected page only visible after login in)</a
          >
        </li>
      </ul>
    </nav>

    <hr />
    <router-outlet />
  `,
})
export class App {}
