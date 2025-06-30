import { createAction, props } from '@ngrx/store';
import { User } from './event.service';

// Load Users Actions
export const loadUsers = createAction('[Event] Load Users');

export const loadUsersSuccess = createAction(
  '[Event] Load Users Success',
  props<{ users: User[] }>(),
);

export const loadUsersFailure = createAction(
  '[Event] Load Users Failure',
  props<{ error: string }>(),
);

// Load Single User Actions
export const loadUser = createAction(
  '[Event] Load User',
  props<{ id: number }>(),
);

export const loadUserSuccess = createAction(
  '[Event] Load User Success',
  props<{ user: User }>(),
);

export const loadUserFailure = createAction(
  '[Event] Load User Failure',
  props<{ error: string }>(),
);

// Create User Actions
export const createUser = createAction(
  '[Event] Create User',
  props<{ user: Omit<User, 'id'> }>(),
);

export const createUserSuccess = createAction(
  '[Event] Create User Success',
  props<{ user: User }>(),
);

export const createUserFailure = createAction(
  '[Event] Create User Failure',
  props<{ error: string }>(),
);

// Update User Actions
export const updateUser = createAction(
  '[Event] Update User',
  props<{ id: number; user: Partial<User> }>(),
);

export const updateUserSuccess = createAction(
  '[Event] Update User Success',
  props<{ user: User }>(),
);

export const updateUserFailure = createAction(
  '[Event] Update User Failure',
  props<{ error: string }>(),
);

// Delete User Actions
export const deleteUser = createAction(
  '[Event] Delete User',
  props<{ id: number }>(),
);

export const deleteUserSuccess = createAction(
  '[Event] Delete User Success',
  props<{ id: number }>(),
);

export const deleteUserFailure = createAction(
  '[Event] Delete User Failure',
  props<{ error: string }>(),
);
