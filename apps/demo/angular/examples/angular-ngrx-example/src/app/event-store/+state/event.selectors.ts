import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventState } from './event.reducer';
import { User } from './event.service';

// Feature selector
export const selectEventState = createFeatureSelector<EventState>('event');

// Base selectors
export const selectUsers = createSelector(
  selectEventState,
  (state: EventState) => state.users,
);

export const selectSelectedUser = createSelector(
  selectEventState,
  (state: EventState) => state.selectedUser,
);

export const selectLoading = createSelector(
  selectEventState,
  (state: EventState) => state.loading,
);

export const selectError = createSelector(
  selectEventState,
  (state: EventState) => state.error,
);

// Derived selectors
export const selectUsersCount = createSelector(
  selectUsers,
  (users: User[]) => users.length,
);

export const selectActiveUsers = createSelector(selectUsers, (users: User[]) =>
  users.filter((user) => user.isActive),
);

export const selectInactiveUsers = createSelector(
  selectUsers,
  (users: User[]) => users.filter((user) => !user.isActive),
);

export const selectActiveUsersCount = createSelector(
  selectActiveUsers,
  (activeUsers: User[]) => activeUsers.length,
);

export const selectUsersByDepartment = createSelector(
  selectUsers,
  (users: User[]) => {
    return users.reduce(
      (acc, user) => {
        const department = user.department;
        if (!acc[department]) {
          acc[department] = [];
        }
        acc[department].push(user);
        return acc;
      },
      {} as Record<string, User[]>,
    );
  },
);

export const selectDepartments = createSelector(
  selectUsers,
  (users: User[]) => {
    const departments = users.map((user) => user.department);
    return [...new Set(departments)].sort();
  },
);

// Parametrized selectors
export const selectUserById = (id: number) =>
  createSelector(
    selectUsers,
    (users: User[]) => users.find((user) => user.id === id) || null,
  );

export const selectUsersByAge = (minAge: number, maxAge?: number) =>
  createSelector(selectUsers, (users: User[]) => {
    return users.filter((user) => {
      if (maxAge !== undefined) {
        return user.age >= minAge && user.age <= maxAge;
      }
      return user.age >= minAge;
    });
  });

export const selectUsersByDepartmentName = (department: string) =>
  createSelector(selectUsers, (users: User[]) =>
    users.filter(
      (user) => user.department.toLowerCase() === department.toLowerCase(),
    ),
  );

// Combined selectors for UI states
export const selectUsersWithLoadingState = createSelector(
  selectUsers,
  selectLoading,
  selectError,
  (users, loading, error) => ({
    users,
    loading,
    error,
    hasUsers: users.length > 0,
  }),
);

export const selectSelectedUserWithLoadingState = createSelector(
  selectSelectedUser,
  selectLoading,
  selectError,
  (selectedUser, loading, error) => ({
    selectedUser,
    loading,
    error,
    hasSelectedUser: selectedUser !== null,
  }),
);

// Statistics selectors
export const selectUserStatistics = createSelector(
  selectUsers,
  (users: User[]) => {
    if (users.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        averageAge: 0,
        departments: 0,
      };
    }

    const active = users.filter((user) => user.isActive).length;
    const inactive = users.length - active;
    const averageAge =
      users.reduce((sum, user) => sum + user.age, 0) / users.length;
    const departments = new Set(users.map((user) => user.department)).size;

    return {
      total: users.length,
      active,
      inactive,
      averageAge: Math.round(averageAge * 100) / 100,
      departments,
    };
  },
);

// Search selector
export const selectUsersBySearchTerm = (searchTerm: string) =>
  createSelector(selectUsers, (users: User[]) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return users;
    }

    const term = searchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term),
    );
  });
