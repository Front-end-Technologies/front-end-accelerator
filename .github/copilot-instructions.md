You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead
- prefer separating styles into a separate file instead of using inline styles

## CSS Best Practices

- Always create a separate stylesheet for each component (e.g., `component-name.component.css`)
- Avoid inline styles in templates and components
- Use BEM (Block Element Modifier) notation for CSS class naming
- Keep styles scoped to components using Angular's view encapsulation
- Use CSS custom properties (variables) for consistent theming
- Follow a mobile-first approach with responsive design

### BEM Naming Convention

- **Block**: The main component name (e.g., `.user-card`)
- **Element**: Parts of the block (e.g., `.user-card__title`, `.user-card__avatar`)
- **Modifier**: Variations or states (e.g., `.user-card--featured`, `.user-card__title--large`)

Example:

```css
.user-card {
  /* Block styles */
}

.user-card__title {
  /* Element styles */
}

.user-card__title--large {
  /* Modifier styles */
}

.user-card--featured {
  /* Block modifier styles */
}
```

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
