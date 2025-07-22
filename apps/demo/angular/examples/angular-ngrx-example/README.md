# Angular State Management Cookbook

This project demonstrates various Angular state management techniques including NgRx Store, NgRx Signals, and traditional services.

## Development server

To start the Angular development server only:

```bash
npm run start
# or
npm run dev
```

To start both the Angular development server and the JSON server concurrently:

```bash
npm run start:all
# or
npm run dev:all
```

The Angular app will be available at `http://localhost:4200/` and the JSON server API at `http://localhost:3001/`.

## JSON Server API

The project includes a `db.json` file with sample data for demonstrating state management. The JSON server provides a REST API with the following endpoints:

- `GET /users` - List all users
- `GET /users/:id` - Get a specific user
- `GET /products` - List all products
- `GET /products/:id` - Get a specific product
- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get a specific task
- `GET /posts` - List all posts
- `GET /posts/:id` - Get a specific post
- `GET /settings` - Get application settings

You can also use POST, PUT, PATCH, and DELETE methods to modify the data.

## State Management Examples

This project demonstrates:

1. **NgRx Store** - Traditional Redux-style state management
2. **NgRx Signals** - Lightweight signal-based state management
3. **Services with Signals** - Simple state management with Angular signals
4. **HTTP Client** - Data fetching and caching strategies

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
