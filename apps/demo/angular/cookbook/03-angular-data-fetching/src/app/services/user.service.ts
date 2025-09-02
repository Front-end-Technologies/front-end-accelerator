import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsersResponse } from '../interfaces/user.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/users';

  fetchUsers() {
    return fetch(this.apiUrl);
  }

  getUsersPromise() {
    return lastValueFrom(this.http.get<UsersResponse>(this.apiUrl));
  }

  getUsersRx() {
    return this.http.get<UsersResponse>(this.apiUrl);
  }

  getUser(userId: string) {
    return lastValueFrom(
      this.http.get<UsersResponse>(`${this.apiUrl}/${userId}`),
    );
  }
}
