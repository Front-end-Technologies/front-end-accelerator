import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Auth } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  template: `
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
  `,
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  credentials = signal<Auth | null>(null);

  loginForm = new FormGroup({
    password: new FormControl('emilyspass', Validators.required),
    username: new FormControl('emilys', Validators.required),
  });

  logout() {
    this.credentials.set(null);
    localStorage.removeItem('auth');
  }

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth) {
      this.credentials.set(JSON.parse(auth));
    }
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
    }
  }
}
