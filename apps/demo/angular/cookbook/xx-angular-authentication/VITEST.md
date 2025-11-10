# Vitest Setup for Angular

This project now includes Vitest as an alternative testing framework alongside the existing Jest/Karma setup.

## What was added

### Dependencies

- `vitest` - The main testing framework
- `@vitest/ui` - Web UI for running and viewing tests
- `@vitest/coverage-v8` - Coverage provider
- `jsdom` - DOM environment for testing
- `@angular/build` - Angular build tools for Vitest integration

### Configuration Files

- `vitest.config.ts` - Main Vitest configuration
- `src/test-setup.ts` - Test setup file with Angular testing utilities

### Scripts

New npm scripts added to `package.json`:

- `test:vitest` - Run tests in watch mode
- `test:vitest:run` - Run tests once
- `test:vitest:ui` - Run tests with web UI (requires `npm run test:vitest:ui` in project directory)
- `test:vitest:coverage` - Run tests with coverage report

## Running Tests

### Command Line

```bash
# Run tests once
npx vitest run

# Run tests in watch mode
npx vitest

# Run with coverage
npx vitest run --coverage

# Run specific test file
npx vitest run src/app/app.component.vitest.spec.ts
```

### Test Files

- Test files should end with `.vitest.spec.ts` to distinguish from Jest tests
- Alternatively, you can use `.test.ts` or `.spec.ts` (but may conflict with Jest)

## Example Test

See `src/app/app.component.vitest.spec.ts` for an example of testing Angular components with Vitest.

## Key Differences from Jest

- Uses Vite's fast bundling for tests
- More modern ESM support
- Built-in TypeScript support
- Better performance for large test suites
- Native watch mode
- Integrated web UI

## Configuration Notes

- Tests run in `jsdom` environment for Angular components
- Zone.js is properly configured for Angular testing
- Coverage reports exclude test files and setup files
- Supports both standalone and module-based Angular components
