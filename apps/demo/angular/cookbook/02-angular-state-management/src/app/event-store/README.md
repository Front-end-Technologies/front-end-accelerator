# Event Store State Management Pattern

This folder demonstrates a comprehensive NgRx-based state management pattern using signals and the Event Store architecture. This pattern provides a robust, scalable approach to managing complex application state with excellent developer experience.

## 📁 Architecture Overview

The Event Store pattern follows a structured approach with clear separation of concerns:

```
+state/
├── event.actions.ts      # Action definitions
├── event.effects.ts      # Side effects handling
├── event.facade.ts       # Public API layer
├── event.reducer.ts      # State transitions
├── event.selectors.ts    # State selection logic
└── event.service.ts      # Data layer & types
```

## 🏗️ Core Components

### 1. **Actions** (`event.actions.ts`)

Actions represent events that occur in your application. They are the only way to trigger state changes.

**Pattern:**

- **Trigger Action**: User initiates an action (e.g., `loadUsers`)
- **Success Action**: Async operation succeeds (e.g., `loadUsersSuccess`)
- **Failure Action**: Async operation fails (e.g., `loadUsersFailure`)

```typescript
// Load Users Actions
export const loadUsers = createAction("[Event] Load Users");
export const loadUsersSuccess = createAction("[Event] Load Users Success", props<{ users: User[] }>());
export const loadUsersFailure = createAction("[Event] Load Users Failure", props<{ error: string }>());
```

### 2. **Reducer** (`event.reducer.ts`)

Pure functions that handle state transitions based on dispatched actions.

```typescript
export interface EventState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export const eventReducer = createReducer(
  initialState,
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
);
```

### 3. **Selectors** (`event.selectors.ts`)

Composable functions for selecting and deriving data from the state.

```typescript
export const selectUsers = createSelector(selectEventState, (state: EventState) => state.users);

export const selectActiveUsers = createSelector(selectUsers, (users: User[]) => users.filter((user) => user.isActive));
```

### 4. **Effects** (`event.effects.ts`)

Handle side effects like HTTP requests, logging, and other async operations.

```typescript
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(EventActions.loadUsers),
    switchMap(() =>
      this.eventService.getUsers().pipe(
        map((users) => EventActions.loadUsersSuccess({ users })),
        catchError((error) => of(EventActions.loadUsersFailure({ error: error.message }))),
      ),
    ),
  ),
);
```

### 5. **Facade** (`event.facade.ts`)

The public API that components interact with. Provides signals and action dispatchers.

```typescript
export class EventFacade {
  // Signals for reactive state
  readonly users = this.store.selectSignal(EventSelectors.selectUsers);
  readonly loading = this.store.selectSignal(EventSelectors.selectLoading);

  // Computed signals for derived state
  readonly hasUsers = computed(() => this.users().length > 0);

  // Action dispatchers
  loadUsers(): void {
    this.store.dispatch(EventActions.loadUsers());
  }
}
```

### 6. **Service** (`event.service.ts`)

Handles data operations and defines interfaces.

```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  isActive: boolean;
}

@Injectable({ providedIn: "root" })
export class EventService {
  getUsers(): Observable<User[]> {
    // HTTP operations
  }
}
```

## 🚀 How to Use This State

### In Components

```typescript
@Component({
  selector: "app-user-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly facade = inject(EventFacade);

  // Access state via signals
  users = this.facade.users;
  loading = this.facade.loading;
  hasUsers = this.facade.hasUsers;

  ngOnInit() {
    // Dispatch actions
    this.facade.loadUsers();
  }

  onUserSelect(user: User) {
    this.facade.loadUser(user.id);
  }

  onUserCreate(userData: Omit<User, "id">) {
    this.facade.createUser(userData);
  }
}
```

### In Templates

```html
<div class="user-list">
  @if (loading()) {
  <div class="loading">Loading users...</div>
  } @if (hasUsers()) { @for (user of users(); track user.id) {
  <div class="user-card" (click)="onUserSelect(user)">{{ user.firstName }} {{ user.lastName }}</div>
  } } @else {
  <div class="empty-state">No users found</div>
  }
</div>
```

## 🔧 How to Implement This Pattern for Other Entities

Follow these steps to create a new state store for any entity (e.g., Products, Orders, etc.):

### Step 1: Define Your Entity and Service

```typescript
// product.service.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Injectable({ providedIn: "root" })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>("/api/products");
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.http.post<Product>("/api/products", product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`/api/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`/api/products/${id}`);
  }
}
```

### Step 2: Create Actions

```typescript
// product.actions.ts
import { createAction, props } from "@ngrx/store";
import { Product } from "./product.service";

// Load Products
export const loadProducts = createAction("[Product] Load Products");
export const loadProductsSuccess = createAction("[Product] Load Products Success", props<{ products: Product[] }>());
export const loadProductsFailure = createAction("[Product] Load Products Failure", props<{ error: string }>());

// Load Single Product
export const loadProduct = createAction("[Product] Load Product", props<{ id: number }>());
export const loadProductSuccess = createAction("[Product] Load Product Success", props<{ product: Product }>());

// CRUD Operations
export const createProduct = createAction("[Product] Create Product", props<{ product: Omit<Product, "id"> }>());
export const createProductSuccess = createAction("[Product] Create Product Success", props<{ product: Product }>());

export const updateProduct = createAction("[Product] Update Product", props<{ id: number; product: Partial<Product> }>());
export const updateProductSuccess = createAction("[Product] Update Product Success", props<{ product: Product }>());

export const deleteProduct = createAction("[Product] Delete Product", props<{ id: number }>());
export const deleteProductSuccess = createAction("[Product] Delete Product Success", props<{ id: number }>());
```

### Step 3: Create Reducer

```typescript
// product.reducer.ts
import { createReducer, on } from "@ngrx/store";
import { Product } from "./product.service";
import * as ProductActions from "./product.actions";

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    error: null,
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
  })),

  // Update Product
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    selectedProduct: state.selectedProduct?.id === product.id ? product : state.selectedProduct,
  })),

  // Delete Product
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
  })),
);
```

### Step 4: Create Selectors

```typescript
// product.selectors.ts
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductState } from "./product.reducer";

export const selectProductState = createFeatureSelector<ProductState>("products");

export const selectProducts = createSelector(selectProductState, (state: ProductState) => state.products);

export const selectSelectedProduct = createSelector(selectProductState, (state: ProductState) => state.selectedProduct);

export const selectLoading = createSelector(selectProductState, (state: ProductState) => state.loading);

export const selectError = createSelector(selectProductState, (state: ProductState) => state.error);

// Derived selectors
export const selectInStockProducts = createSelector(selectProducts, (products) => products.filter((product) => product.inStock));

export const selectProductsByCategory = createSelector(selectProducts, (products) => {
  return products.reduce(
    (acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );
});

export const selectProductById = (id: number) => createSelector(selectProducts, (products) => products.find((product) => product.id === id) || null);
```

### Step 5: Create Effects

```typescript
// product.effects.ts
import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { ProductService } from "./product.service";
import * as ProductActions from "./product.actions";

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap((action) =>
        this.productService.getProduct(action.id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap((action) =>
        this.productService.createProduct(action.product).pipe(
          map((product) => ProductActions.createProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap((action) =>
        this.productService.updateProduct(action.id, action.product).pipe(
          map((product) => ProductActions.updateProductSuccess({ product })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap((action) =>
        this.productService.deleteProduct(action.id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id: action.id })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
```

### Step 6: Create Facade

```typescript
// product.facade.ts
import { Injectable, inject, computed } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Product } from "./product.service";
import * as ProductActions from "./product.actions";
import * as ProductSelectors from "./product.selectors";
import { ProductState } from "./product.reducer";

@Injectable({
  providedIn: "root",
})
export class ProductFacade {
  private readonly store = inject(Store<ProductState>);

  // Signals
  readonly products = this.store.selectSignal(ProductSelectors.selectProducts);
  readonly selectedProduct = this.store.selectSignal(ProductSelectors.selectSelectedProduct);
  readonly loading = this.store.selectSignal(ProductSelectors.selectLoading);
  readonly error = this.store.selectSignal(ProductSelectors.selectError);
  readonly inStockProducts = this.store.selectSignal(ProductSelectors.selectInStockProducts);
  readonly productsByCategory = this.store.selectSignal(ProductSelectors.selectProductsByCategory);

  // Computed signals
  readonly hasProducts = computed(() => this.products().length > 0);
  readonly hasInStockProducts = computed(() => this.inStockProducts().length > 0);
  readonly hasSelectedProduct = computed(() => this.selectedProduct() !== null);
  readonly isLoading = computed(() => this.loading());
  readonly hasError = computed(() => this.error() !== null);

  // Action dispatchers
  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadProduct(id: number): void {
    this.store.dispatch(ProductActions.loadProduct({ id }));
  }

  createProduct(product: Omit<Product, "id">): void {
    this.store.dispatch(ProductActions.createProduct({ product }));
  }

  updateProduct(id: number, product: Partial<Product>): void {
    this.store.dispatch(ProductActions.updateProduct({ id, product }));
  }

  deleteProduct(id: number): void {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }

  // Parametrized selectors
  getProductById(id: number): Observable<Product | null> {
    return this.store.select(ProductSelectors.selectProductById(id));
  }

  // Utility methods
  refreshProducts(): void {
    this.loadProducts();
  }

  isProductSelected(productId: number) {
    return computed(() => this.selectedProduct()?.id === productId);
  }
}
```

### Step 7: Register in App

```typescript
// app.config.ts
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { productReducer } from "./features/product/+state/product.reducer";
import { ProductEffects } from "./features/product/+state/product.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      products: productReducer,
      // other reducers...
    }),
    provideEffects([ProductEffects]),
    // other providers...
  ],
};
```

## 🎯 Best Practices

### 1. **Naming Conventions**

- Actions: `[Feature] Action Description`
- Files: `entity.suffix.ts` (e.g., `user.actions.ts`)
- Folders: Use `+state` to indicate state management files

### 2. **State Shape**

- Keep state flat and normalized
- Include loading and error states
- Use typed interfaces

### 3. **Selectors**

- Create composable selectors
- Use memoization for performance
- Keep selector logic pure

### 4. **Effects**

- Handle all side effects in effects
- Use appropriate operators (`switchMap`, `mergeMap`, `concatMap`)
- Always handle errors

### 5. **Facade Pattern**

- Expose signals for reactive state
- Provide computed signals for derived state
- Keep action dispatchers simple
- Hide store complexity from components

## 🔍 Testing

### Testing Reducers

```typescript
describe("ProductReducer", () => {
  it("should set loading to true when loadProducts is dispatched", () => {
    const action = ProductActions.loadProducts();
    const result = productReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
  });
});
```

### Testing Effects

```typescript
describe("ProductEffects", () => {
  it("should dispatch loadProductsSuccess when service succeeds", () => {
    const products = [{ id: 1, name: "Product 1" }];
    const action = ProductActions.loadProducts();
    const outcome = ProductActions.loadProductsSuccess({ products });

    actions$ = hot("-a", { a: action });
    productService.getProducts.and.returnValue(cold("-b|", { b: products }));

    expect(effects.loadProducts$).toBeObservable(cold("--c", { c: outcome }));
  });
});
```

### Testing Facades

```typescript
describe("ProductFacade", () => {
  it("should dispatch loadProducts action", () => {
    spyOn(store, "dispatch");

    facade.loadProducts();

    expect(store.dispatch).toHaveBeenCalledWith(ProductActions.loadProducts());
  });
});
```

## 📈 Performance Considerations

1. **Use OnPush Change Detection**: Always set `changeDetection: ChangeDetectionStrategy.OnPush`
2. **Memoized Selectors**: NgRx selectors are automatically memoized
3. **Signals**: Use signals for better performance and developer experience
4. **Lazy Loading**: Consider feature-based state modules for large applications

## 🔄 Migration from Simple State

When migrating from simple component state to this pattern:

1. **Identify State**: Extract component state to interfaces
2. **Create Actions**: Map component methods to actions
3. **Move Logic**: Move business logic to effects and selectors
4. **Update Components**: Replace direct state access with facade calls
5. **Test**: Ensure all functionality works as expected

This pattern provides excellent scalability, testability, and maintainability for complex Angular applications while leveraging the power of NgRx and Angular signals.
