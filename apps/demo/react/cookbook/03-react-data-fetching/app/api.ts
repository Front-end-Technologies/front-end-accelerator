import type { UsersResponse } from './users';

import { baseUrl } from './const';
import { http } from './http';

export const fetchUsers = () =>
  fetch(`${baseUrl}/users?limit=5`).then(
    (res) => res.json() as Promise<UsersResponse>
  );

export const getUsersAxios = () =>
  http.get(`/users`, {
    params: {
      limit: 5,
    },
  }) as Promise<UsersResponse>;
