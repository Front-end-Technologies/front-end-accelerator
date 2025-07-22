import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './event.service';
import * as EventActions from './event.actions';
import * as EventSelectors from './event.selectors';
import { EventState } from './event.reducer';

@Injectable({
  providedIn: 'root',
})
export class EventFacade {
  private readonly store = inject(Store<EventState>);

  // Signals
  readonly users = this.store.selectSignal(EventSelectors.selectUsers);
  readonly selectedUser = this.store.selectSignal(
    EventSelectors.selectSelectedUser,
  );
  readonly loading = this.store.selectSignal(EventSelectors.selectLoading);
  readonly error = this.store.selectSignal(EventSelectors.selectError);
  readonly usersCount = this.store.selectSignal(
    EventSelectors.selectUsersCount,
  );
  readonly activeUsers = this.store.selectSignal(
    EventSelectors.selectActiveUsers,
  );
  readonly inactiveUsers = this.store.selectSignal(
    EventSelectors.selectInactiveUsers,
  );
  readonly activeUsersCount = this.store.selectSignal(
    EventSelectors.selectActiveUsersCount,
  );
  readonly usersByDepartment = this.store.selectSignal(
    EventSelectors.selectUsersByDepartment,
  );
  readonly departments = this.store.selectSignal(
    EventSelectors.selectDepartments,
  );
  readonly usersWithLoadingState = this.store.selectSignal(
    EventSelectors.selectUsersWithLoadingState,
  );
  readonly selectedUserWithLoadingState = this.store.selectSignal(
    EventSelectors.selectSelectedUserWithLoadingState,
  );
  readonly userStatistics = this.store.selectSignal(
    EventSelectors.selectUserStatistics,
  );

  // Computed signals for common UI states
  readonly hasUsers = computed(() => this.users().length > 0);
  readonly hasActiveUsers = computed(() => this.activeUsers().length > 0);
  readonly hasSelectedUser = computed(() => this.selectedUser() !== null);
  readonly isLoading = computed(() => this.loading());
  readonly hasError = computed(() => this.error() !== null);

  // Action dispatchers
  loadUsers(): void {
    this.store.dispatch(EventActions.loadUsers());
  }

  loadUser(id: number): void {
    this.store.dispatch(EventActions.loadUser({ id }));
  }

  createUser(user: Omit<User, 'id'>): void {
    this.store.dispatch(EventActions.createUser({ user }));
  }

  updateUser(id: number, user: Partial<User>): void {
    this.store.dispatch(EventActions.updateUser({ id, user }));
  }

  deleteUser(id: number): void {
    this.store.dispatch(EventActions.deleteUser({ id }));
  }

  // Parametrized selector methods (still return observables for dynamic parameters)
  getUserById(id: number): Observable<User | null> {
    return this.store.select(EventSelectors.selectUserById(id));
  }

  getUsersByAge(minAge: number, maxAge?: number): Observable<User[]> {
    return this.store.select(EventSelectors.selectUsersByAge(minAge, maxAge));
  }

  getUsersByDepartmentName(department: string): Observable<User[]> {
    return this.store.select(
      EventSelectors.selectUsersByDepartmentName(department),
    );
  }

  getUsersBySearchTerm(searchTerm: string): Observable<User[]> {
    return this.store.select(
      EventSelectors.selectUsersBySearchTerm(searchTerm),
    );
  }

  // Utility methods for common operations
  refreshUsers(): void {
    this.loadUsers();
  }

  clearSelectedUser(): void {
    // If you have a clear selected user action, you can add it
    // For now, you can load a user with an invalid ID or implement the action
  }

  isUserSelected(userId: number): Observable<boolean> {
    return this.store
      .select(EventSelectors.selectSelectedUser)
      .pipe(map((selectedUser: User | null) => selectedUser?.id === userId));
  }

  // Signal-based utility methods
  isUserSelectedSignal(userId: number) {
    return computed(() => this.selectedUser()?.id === userId);
  }

  // Convenience methods for common UI operations
  loadAndSelectUser(id: number): void {
    this.loadUser(id);
  }

  createAndRefresh(user: Omit<User, 'id'>): void {
    this.createUser(user);
    // Note: The effects will handle updating the state automatically
  }

  updateAndRefresh(id: number, user: Partial<User>): void {
    this.updateUser(id, user);
    // Note: The effects will handle updating the state automatically
  }

  deleteAndRefresh(id: number): void {
    this.deleteUser(id);
    // Note: The effects will handle updating the state automatically
  }
}
