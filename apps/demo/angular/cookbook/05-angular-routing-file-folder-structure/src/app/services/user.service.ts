import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { User, UsersResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://dummyjson.com/users';

  private http = inject(HttpClient);

  getUser(userId: string) {
    return lastValueFrom(this.http.get<User>(`${this.apiUrl}/${userId}`));
  }

  getUsers() {
    return lastValueFrom(this.http.get<UsersResponse>(this.apiUrl));
  }
}
