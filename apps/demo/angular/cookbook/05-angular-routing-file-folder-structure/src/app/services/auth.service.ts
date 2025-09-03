import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'https://dummyjson.com/auth';
  private readonly http = inject(HttpClient);

  login(credentials: { password: string; username: string }) {
    return lastValueFrom(
      this.http.post<Auth>(`${this.baseUrl}/login`, credentials),
    );
  }

  me(accessToken: string) {
    return lastValueFrom(
      this.http.get<Auth>(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  }
}
