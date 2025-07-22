import { createReducer, on } from '@ngrx/store';
import { User } from './event.service';
import * as EventActions from './event.actions';

export interface EventState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: EventState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const eventReducer = createReducer(
  initialState,

  // Load Users
  on(EventActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),

  on(EventActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single User
  on(EventActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
    error: null,
  })),

  on(EventActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create User
  on(EventActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
    error: null,
  })),

  on(EventActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update User
  on(EventActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser:
      state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(EventActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete User
  on(EventActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((user) => user.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    loading: false,
    error: null,
  })),

  on(EventActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
