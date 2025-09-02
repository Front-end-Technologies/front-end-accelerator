import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { UsersResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://dummyjson.com/users';

  private http = inject(HttpClient);

  fetchUsers() {
    return fetch(this.apiUrl);
  }

  getUser(userId: string) {
    return lastValueFrom(
      this.http.get<UsersResponse>(`${this.apiUrl}/${userId}`),
    );
  }

  getUsersPromise() {
    return lastValueFrom(this.http.get<UsersResponse>(this.apiUrl));
  }

  getUsersRx() {
    return this.http.get<UsersResponse>(this.apiUrl);
  }
}
