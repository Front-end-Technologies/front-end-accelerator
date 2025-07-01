import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserService } from './signal-store.service';
import { exhaustMap, pipe, tap } from 'rxjs';
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  isActive: boolean;
  createdAt: string;
}
import { tapResponse } from '@ngrx/operators';
import { loadUser } from '../event-store/+state/event.actions';
import {
  setError,
  setLoading,
  setSuccess,
  withLoadable,
} from './signal-store.features';

interface UserState {
  users: User[];
  selectedUser: User | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
};

export const UserStore = signalStore(
  withState<UserState>(initialState),
  withLoadable(),
  // Inject the UserService to use it in the store
  withProps(() => ({
    userService: inject(UserService),
  })),
  // Define the state as a signal store, you can look at these as @ngrx/store's selectors
  withComputed(({ users }) => ({
    usersCount: computed(() => users().length),
    users: computed(() => users()),
  })),
  // Define methods to interact with the store
  withMethods((store) => {
    const loadUsers = rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, setLoading());
        }),
        exhaustMap(() => {
          return store.userService.getUsers().pipe(
            tapResponse({
              next: (users) => {
                patchState(store, { users }, setSuccess());
              },
              error: (error: string) => {
                console.error('Failed to load users:', error);
                patchState(store, setError(error));
              },
            }),
          );
        }),
      ),
    );
    return { loadUsers };
  }),
  // Define hooks to run on store initialization
  withHooks({
    onInit({ loadUsers }) {
      loadUsers();
    },
  }),
);
