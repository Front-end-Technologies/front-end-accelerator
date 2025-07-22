import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs';
import { EventService, User } from './event.service';
import * as EventActions from './event.actions';

export const loadUsers$ = createEffect(
  (actions$ = inject(Actions), eventService = inject(EventService)) =>
    actions$.pipe(
      ofType(EventActions.loadUsers),
      switchMap(() =>
        eventService.getUsers().pipe(
          map((users: User[]) => EventActions.loadUsersSuccess({ users })),
          catchError((error: any) =>
            of(EventActions.loadUsersFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadUser$ = createEffect(
  (actions$ = inject(Actions), eventService = inject(EventService)) =>
    actions$.pipe(
      ofType(EventActions.loadUser),
      switchMap(({ id }: { id: number }) =>
        eventService.getUser(id).pipe(
          map((user: User) => EventActions.loadUserSuccess({ user })),
          catchError((error: any) =>
            of(EventActions.loadUserFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const createUser$ = createEffect(
  (actions$ = inject(Actions), eventService = inject(EventService)) =>
    actions$.pipe(
      ofType(EventActions.createUser),
      switchMap(({ user }: { user: Omit<User, 'id'> }) =>
        eventService.createUser(user).pipe(
          map((createdUser: User) =>
            EventActions.createUserSuccess({ user: createdUser }),
          ),
          catchError((error: any) =>
            of(EventActions.createUserFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const updateUser$ = createEffect(
  (actions$ = inject(Actions), eventService = inject(EventService)) =>
    actions$.pipe(
      ofType(EventActions.updateUser),
      switchMap(({ id, user }: { id: number; user: Partial<User> }) =>
        eventService.updateUser(id, user).pipe(
          map((updatedUser: User) =>
            EventActions.updateUserSuccess({ user: updatedUser }),
          ),
          catchError((error: any) =>
            of(EventActions.updateUserFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const deleteUser$ = createEffect(
  (actions$ = inject(Actions), eventService = inject(EventService)) =>
    actions$.pipe(
      ofType(EventActions.deleteUser),
      switchMap(({ id }: { id: number }) =>
        eventService.deleteUser(id).pipe(
          map(() => EventActions.deleteUserSuccess({ id })),
          catchError((error: any) =>
            of(EventActions.deleteUserFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
