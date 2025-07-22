# Angular Signal Store Documentation

## Overview

The Signal Store is a modern state management solution built on top of **@ngrx/signals**, providing a reactive and type-safe approach to managing application state in Angular. This implementation demonstrates how to create a scalable, feature-rich store using Angular's signal-based architecture.

## Architecture

The signal store implementation consists of several key files:

- `signal-store.store.ts` - Main store definition and configuration
- `signal-store.features.ts` - Reusable store features (like loading states)
- `signal-store.service.ts` - Data access service for API calls
- `signal-store.component.ts` - Component that consumes the store
- `signal-store.helpers.ts` - Utility functions for store operations

## Core Implementation

### Store Definition (`signal-store.store.ts`)

The main store is created using the `signalStore` function

```typescript
export const UserStore = signalStore(
  withState<UserState>(initialState),
  withLoadable(),
  withProps(() => ({ userService: inject(UserService) })),
  withComputed(({ users }) => ({
    usersCount: computed(() => users().length),
    users: computed(() => users()),
  })),
  withMethods((store) => ({ loadUsers })),
  withHooks({
    onInit({ loadUsers }) {
      loadUsers();
    },
  }),
);
```

## The 'with' Functions Explained

### 1. `withState<T>(initialState)`

**Purpose**: Defines the base state structure and initial values for the store.

**Usage**:

```typescript
interface UserState {
  users: User[];
  selectedUser: User | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
};

withState<UserState>(initialState);
```

**What it provides**:

- Creates deep signals for each state property
- Establishes the TypeScript interface for the state
- Sets default values for all state properties

### 2. `withComputed(factory)`

**Purpose**: Creates derived state (computed signals) based on existing state.

**Usage**:

```typescript
withComputed(({ users }) => ({
  usersCount: computed(() => users().length),
  activeUsers: computed(() => users().filter((u) => u.isActive)),
  departmentCounts: computed(() => {
    // Complex derived state logic
  }),
}));
```

**What it provides**:

- Reactive computed values that update when dependencies change
- Memoized calculations for performance
- Type-safe access to derived state

### 3. `withMethods(factory)`

**Purpose**: Defines actions and operations that can modify the store state.

**Usage**:

```typescript
withMethods((store) => {
  const loadUsers = rxMethod<void>(
    pipe(
      tap(() => patchState(store, setLoading())),
      exhaustMap(() =>
        store.userService.getUsers().pipe(
          tapResponse({
            next: (users) => patchState(store, { users }, setSuccess()),
            error: (error) => patchState(store, setError(error)),
          }),
        ),
      ),
    ),
  );

  return {
    loadUsers,
    selectUser: (user: User) => patchState(store, { selectedUser: user }),
    clearSelection: () => patchState(store, { selectedUser: null }),
  };
});
```

**What it provides**:

- Type-safe methods for state modifications
- Integration with RxJS operators for side effects via `rxMethod`
- Access to `patchState` for updating store state

### 4. `withProps(factory)`

**Purpose**: Injects dependencies and provides additional properties to the store.

**Usage**:

```typescript
withProps(() => ({
  userService: inject(UserService),
  router: inject(Router),
  notificationService: inject(NotificationService),
}));
```

**What it provides**:

- Dependency injection within the store
- Access to services and external dependencies
- Shared properties across all store methods

### 5. `withHooks(config)`

**Purpose**: Defines lifecycle hooks for the store (initialization, cleanup, etc.).

**Usage**:

```typescript
withHooks({
  onInit({ loadUsers }) {
    loadUsers(); // Auto-load data when store initializes
  },
  onDestroy({ cleanup }) {
    cleanup(); // Cleanup when store is destroyed
  },
});
```

**What it provides**:

- Automatic execution of logic during store lifecycle
- Access to store methods and state during hooks
- Clean initialization and cleanup patterns

## Custom Features

### `withLoadable()` Feature

This is a custom feature that adds loading state management:

```typescript
export function withLoadable() {
  return signalStoreFeature(
    withState<Loadable>({
      loading: false,
      error: null,
      success: false,
    }),
    withComputed(({ loading, error, success }) => ({
      isLoading: computed(() => loading()),
      error: computed(() => error()),
      isSuccess: computed(() => success()),
    })),
  );
}
```

**Helper functions**:

- `setLoading()` - Sets loading state to true
- `setError(error)` - Sets error state with message
- `setSuccess()` - Sets success state to true

## Expanding the Store

### Adding New State Properties

1. **Update the state interface**:

```typescript
interface UserState {
  users: User[];
  selectedUser: User | null;
  filters: UserFilters; // New property
  pagination: PaginationState; // New property
}
```

2. **Update initial state**:

```typescript
const initialState: UserState = {
  users: [],
  selectedUser: null,
  filters: { department: null, isActive: null },
  pagination: { page: 1, size: 10, total: 0 },
};
```

### Adding New Computed Values

```typescript
withComputed(({ users, filters, pagination }) => ({
  // Existing computed values...
  filteredUsers: computed(() => {
    let filtered = users();
    if (filters().department) {
      filtered = filtered.filter((u) => u.department === filters().department);
    }
    return filtered;
  }),
  paginatedUsers: computed(() => {
    const start = (pagination().page - 1) * pagination().size;
    return filteredUsers().slice(start, start + pagination().size);
  }),
}));
```

### Adding New Methods

```typescript
withMethods((store) => {
  // Existing methods...

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    patchState(store, {
      filters: { ...store.filters(), ...newFilters },
      pagination: { ...store.pagination(), page: 1 }, // Reset to first page
    });
  };

  const changePage = (page: number) => {
    patchState(store, { pagination: { ...store.pagination(), page } });
  };

  return {
    loadUsers,
    updateFilters,
    changePage,
  };
});
```

### Creating Custom Features

```typescript
// feature: with-pagination.ts
export function withPagination<T>() {
  return signalStoreFeature(
    withState<PaginationState>({
      page: 1,
      size: 10,
      total: 0,
    }),
    withComputed(({ page, size, total }) => ({
      totalPages: computed(() => Math.ceil(total() / size())),
      hasNextPage: computed(() => page() < Math.ceil(total() / size())),
      hasPrevPage: computed(() => page() > 1),
    })),
    withMethods((store) => ({
      nextPage: () => {
        if (store.hasNextPage()) {
          patchState(store, { page: store.page() + 1 });
        }
      },
      prevPage: () => {
        if (store.hasPrevPage()) {
          patchState(store, { page: store.page() - 1 });
        }
      },
      setPage: (page: number) => patchState(store, { page }),
      setPageSize: (size: number) => patchState(store, { size, page: 1 }),
    })),
  );
}
```

### Creating private members

SignalStore allows defining private members that cannot be accessed from outside the store by using the \_ prefix. This includes root-level state slices, properties, and methods.

```typescript
export const CounterStore = signalStore(
  withState({
    count1: 0,
    // 👇 private state slice
    _count2: 0,
  }),
  withComputed(({ count1, _count2 }) => ({
    // 👇 private computed signal
    _doubleCount1: computed(() => count1() * 2),
    doubleCount2: computed(() => _count2() * 2),
  })),
  withProps(({ count2, _doubleCount1 }) => ({
    // 👇 private property
    _count2$: toObservable(count2),
    doubleCount1$: toObservable(_doubleCount1),
  })),
  withMethods((store) => ({
    increment1(): void {
      patchState(store, { count1: store.count1() + 1 });
    },
    // 👇 private method
    _increment2(): void {
      patchState(store, { _count2: store._count2() + 1 });
    },
  })),
);
export class Counter implements OnInit {
  readonly store = inject(CounterStore);

  ngOnInit(): void {
    console.log(this.store.count1()); // ✅
    console.log(this.store._count2()); // ❌

    console.log(this.store._doubleCount1()); // ❌
    console.log(this.store.doubleCount2()); // ✅

    this.store._count2$.subscribe(console.log); // ❌
    this.store.doubleCount1$.subscribe(console.log); // ✅

    this.store.increment1(); // ✅
    this.store._increment2(); // ❌
  }
}
```

## Usage in Components

### Basic Usage

```typescript
@Component({
  providers: [UserStore], // Provide the store
})
export class UserComponent {
  readonly store = inject(UserStore);

  // Direct access to state
  readonly users = this.store.users;
  readonly isLoading = this.store.isLoading;

  // Access to methods
  loadUsers() {
    this.store.loadUsers();
  }
}
```

### Advanced Usage with Effects

```typescript
export class UserComponent {
  readonly store = inject(UserStore);

  constructor() {
    // React to state changes
    effect(() => {
      if (this.store.error()) {
        this.showErrorNotification(this.store.error()!);
      }
    });

    // Complex side effects
    effect(() => {
      const users = this.store.users();
      if (users.length > 0) {
        this.updateDocumentTitle(`Users (${users.length})`);
      }
    });
  }
}
```

## Best Practices

### 1. Store Composition

- Use multiple `with*` functions to compose store features
- Create reusable features for common patterns (loading, pagination, etc.)
- Keep each feature focused on a single responsibility

### 2. State Design

- Keep state flat and normalized when possible
- Use TypeScript interfaces for better type safety
- Avoid deeply nested state structures

### 3. Method Design

- Use `rxMethod` for async operations
- Always handle loading and error states
- Keep methods pure and predictable

### 4. Performance

- Use `computed()` for expensive calculations
- Leverage signal equality checks for optimization
- Consider using `untracked()` for side effects that shouldn't trigger reactivity

### 5. Testing

- Test store features in isolation
- Mock dependencies using `withProps`
- Test computed values and methods separately

## Integration with RxJS

The signal store provides excellent RxJS integration:

```typescript
// Using rxMethod for reactive operations
const searchUsers = rxMethod<string>(
  pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => patchState(store, setLoading())),
    switchMap((query) =>
      store.userService.searchUsers(query).pipe(
        tapResponse({
          next: (users) => patchState(store, { users }, setSuccess()),
          error: (error) => patchState(store, setError(error)),
        }),
      ),
    ),
  ),
);
```

## Conclusion

The Angular Signal Store provides a powerful, type-safe, and reactive approach to state management. By combining multiple `with*` functions, you can create highly composable and maintainable stores that scale with your application's complexity.

The key benefits include:

- **Type Safety**: Full TypeScript support throughout
- **Reactivity**: Built on Angular signals for optimal performance
- **Composability**: Mix and match features as needed
- **RxJS Integration**: Seamless async operation handling
- **Developer Experience**: Excellent tooling and debugging support
