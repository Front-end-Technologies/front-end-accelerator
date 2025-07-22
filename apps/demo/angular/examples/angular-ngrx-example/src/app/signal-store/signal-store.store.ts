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
  nextPage,
  previousPage,
  resetPagination,
  setError,
  setLoading,
  setPage,
  setPageSize,
  setPagination,
  setSuccess,
  withLoadable,
  withPagination,
} from './signal-store.features';

interface UserState {
  users: User[];
  selectedUser: User | null;
  searchTerm: string;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  searchTerm: '',
};

export const UserStore = signalStore(
  withState<UserState>(initialState),
  withLoadable(),
  withPagination(),
  // Inject the UserService to use it in the store
  withProps(() => ({
    userService: inject(UserService),
  })),
  // Define the state as a signal store, you can look at these as @ngrx/store's selectors
  withComputed(({ users, searchTerm, page, pageSize, total }) => ({
    usersCount: computed(() => users().length),
    users: computed(() => users()),
    filteredUsers: computed(() => {
      const term = searchTerm().toLowerCase().trim();
      if (!term) return users();

      return users().filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term),
      );
    }),
    filteredUsersCount: computed(() => {
      const term = searchTerm().toLowerCase().trim();
      if (!term) return users().length;

      return users().filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term),
      ).length;
    }),
    // Paginated users based on current page and page size
    paginatedUsers: computed(() => {
      const filtered = (() => {
        const term = searchTerm().toLowerCase().trim();
        if (!term) return users();

        return users().filter(
          (user) =>
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.department.toLowerCase().includes(term),
        );
      })();

      const startIndex = (page() - 1) * pageSize();
      const endIndex = startIndex + pageSize();
      return filtered.slice(startIndex, endIndex);
    }),
    // Total pages for the current filtered results
    totalPagesForFiltered: computed(() => {
      const filteredCount = (() => {
        const term = searchTerm().toLowerCase().trim();
        if (!term) return users().length;

        return users().filter(
          (user) =>
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.department.toLowerCase().includes(term),
        ).length;
      })();

      return Math.ceil(filteredCount / pageSize());
    }),
    // Check if there are more pages
    hasNextPage: computed(() => page() < Math.ceil(total() / pageSize())),
    hasPreviousPage: computed(() => page() > 1),
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
                patchState(
                  store,
                  { users },
                  setSuccess(),
                  setPagination(1, 10, users.length),
                );
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

    const updateSearchTerm = (searchTerm: string) => {
      patchState(store, { searchTerm });
      // Reset to first page when searching
      patchState(
        store,
        setPage(
          {
            page: store.page(),
            pageSize: store.pageSize(),
            total: store.total(),
          },
          1,
          store.totalPagesForFiltered(),
        ),
      );
    };

    const clearSearch = () => {
      patchState(store, { searchTerm: '' });
      // Reset to first page when clearing search
      patchState(
        store,
        setPage(
          {
            page: store.page(),
            pageSize: store.pageSize(),
            total: store.total(),
          },
          1,
          store.totalPages(),
        ),
      );
    };

    const goToNextPage = () => {
      const currentPagination = {
        page: store.page(),
        pageSize: store.pageSize(),
        total: store.total(),
      };
      const totalPages = store.totalPagesForFiltered();
      patchState(store, nextPage(currentPagination, totalPages));
    };

    const goToPreviousPage = () => {
      const currentPagination = {
        page: store.page(),
        pageSize: store.pageSize(),
        total: store.total(),
      };
      patchState(store, previousPage(currentPagination));
    };

    const goToPage = (pageNumber: number) => {
      const currentPagination = {
        page: store.page(),
        pageSize: store.pageSize(),
        total: store.total(),
      };
      const totalPages = store.totalPagesForFiltered();
      patchState(store, setPage(currentPagination, pageNumber, totalPages));
    };

    const changePageSize = (newPageSize: number) => {
      const currentPagination = {
        page: store.page(),
        pageSize: store.pageSize(),
        total: store.total(),
      };
      patchState(store, setPageSize(currentPagination, newPageSize));
    };

    const resetPaginationState = () => {
      patchState(store, resetPagination());
    };

    return {
      loadUsers,
      updateSearchTerm,
      clearSearch,
      goToNextPage,
      goToPreviousPage,
      goToPage,
      changePageSize,
      resetPaginationState,
    };
  }),
  // Define hooks to run on store initialization
  withHooks({
    onInit({ loadUsers }) {
      loadUsers();
    },
  }),
);
