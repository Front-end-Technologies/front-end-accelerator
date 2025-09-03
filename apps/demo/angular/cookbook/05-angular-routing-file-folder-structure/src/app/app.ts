import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from './interfaces/auth.interface';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  selector: 'app-root',
  template: `
    <h1>Routing</h1>

    @if (credentials()) {
      <h2>User Logged In</h2>
      <pre>
  {{ credentials() | json }}
    </pre
      >

      <button (click)="logout()">Logout</button>
    }

    @if (!credentials()) {
      <h2>Please Log in</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label>
          Username:
          <input formControlName="username" />
        </label>

        <label>
          Password:
          <input type="password" formControlName="password" />
        </label>

        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    }

    <hr />

    <p>This is a simple example of Angular routing</p>

    <nav>
      <ul>
        <li><a routerLink="about">About (public page, lazy-loaded)</a></li>
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
export class App implements OnInit {
  authService = inject(AuthService);
  credentials = signal<Auth | null>(null);
  loginForm = new FormGroup({
    password: new FormControl('emilyspass', Validators.required),
    username: new FormControl('emilys', Validators.required),
  });

  router = inject(Router);

  logout() {
    this.credentials.set(null);
    localStorage.removeItem('auth');
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.logout();
  }

  async onSubmit() {
    if (
      this.loginForm.valid &&
      this.loginForm.value.username &&
      this.loginForm.value.password
    ) {
      const res = await this.authService.login({
        password: this.loginForm.value.password,
        username: this.loginForm.value.username,
      });

      this.credentials.set(res);
      localStorage.setItem('auth', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
    }
  }
}
