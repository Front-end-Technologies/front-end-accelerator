# Azure B2C Authentication Services

This directory contains the Azure B2C authentication implementation split into three distinct services, each following different architectural patterns.

## Services Overview

### 1. `AzureAuthenticationFlowService` (Facade)

**File**: `azure-authentication-flow.service.ts`

A facade service that provides a unified interface to both signal-based and observable-based implementations. This is the **recommended** service for most use cases as it provides access to both patterns while defaulting to the signal-based approach for convenience methods.

**Features**:

- Unified interface for both patterns
- Convenience methods that delegate to signal service
- Access to both underlying service implementations
- Backwards compatibility

### 2. `AzureAuthenticationFlowSignalService` (Signal-Based)

**File**: `azure-authentication-flow-signal.service.ts`

A modern Angular service using the new Signal-based reactive patterns introduced in Angular 16+.

**Features**:

- Signal-based reactive state management
- Resource API for async operations
- Computed signals for derived state
- Effects for side effects
- Built-in loading and error states
- Type-safe reactive programming

**Best for**:

- New Angular applications (16+)
- Components using signal-based patterns
- Reactive programming enthusiasts
- Applications requiring fine-grained reactivity

### 3. `AzureAuthenticationFlowObservableService` (Observable-Based)

**File**: `azure-authentication-flow-observable.service.ts`

A traditional Angular service using RxJS Observables and BehaviorSubjects.

**Features**:

- RxJS Observable streams
- BehaviorSubject for state management
- Traditional reactive patterns
- Synchronous state access methods
- Familiar Observable API

**Best for**:

- Existing Angular applications
- Teams familiar with RxJS patterns
- Legacy code integration
- Applications heavily using Observables

## Usage Examples

### Using the Facade Service (Recommended)

```typescript
import { Component, effect, inject } from "@angular/core";
import { AzureAuthenticationFlowService } from "./azure-authentication-flow.service";

@Component({
  // ...
})
export class MyComponent {
  private authService = inject(AzureAuthenticationFlowService);

  constructor() {
    // Access signal-based service through facade
    effect(() => {
      const token = this.authService.signalService.accessToken();
      if (token) {
        console.log("Authenticated via signals");
      }
    });

    // Access observable-based service through facade
    this.authService.observableService.accessToken$.subscribe((token) => {
      if (token) {
        console.log("Authenticated via observables");
      }
    });
  }

  login() {
    // Uses signal service by default
    this.authService.login();
  }

  logout() {
    // Clears both services
    this.authService.logout();
  }

  get isAuthenticated() {
    // Uses signal service by default
    return this.authService.isAuthenticated();
  }
}
```

### Using Signal Service Directly

```typescript
import { Component, effect, inject } from "@angular/core";
import { AzureAuthenticationFlowSignalService } from "./azure-authentication-flow-signal.service";

@Component({
  // ...
})
export class SignalComponent {
  private authService = inject(AzureAuthenticationFlowSignalService);

  // Access signals directly
  readonly accessToken = this.authService.accessToken;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        console.log("User is authenticated");
      }
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
```

### Using Observable Service Directly

```typescript
import { Component, inject, OnInit } from "@angular/core";
import { AzureAuthenticationFlowObservableService } from "./azure-authentication-flow-observable.service";

@Component({
  // ...
})
export class ObservableComponent implements OnInit {
  private authService = inject(AzureAuthenticationFlowObservableService);

  ngOnInit() {
    this.authService.accessToken$.subscribe((token) => {
      if (token) {
        console.log("User authenticated:", token);
      }
    });
  }

  async login() {
    await this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
```

## Migration Guide

### From Original Service to Facade Service

If you're currently using the original mixed service:

1. Import the facade service instead:

   ```typescript
   // Before
   import { AzureAuthenticationFlowService } from "./azure-authentication-flow.service";

   // After (no change needed)
   import { AzureAuthenticationFlowService } from "./azure-authentication-flow.service";
   ```

2. Choose your preferred pattern:

   ```typescript
   // Signal-based (recommended for new code)
   effect(() => {
     const token = this.authService.signalService.accessToken();
   });

   // Observable-based (for existing code)
   this.authService.observableService.accessToken$.subscribe((token) => {
     // handle token
   });
   ```

### From Facade to Dedicated Service

If you want to use only one pattern:

```typescript
// Signal-only
import { AzureAuthenticationFlowSignalService } from "./azure-authentication-flow-signal.service";

// Observable-only
import { AzureAuthenticationFlowObservableService } from "./azure-authentication-flow-observable.service";
```

## Architecture Benefits

1. **Separation of Concerns**: Each service has a single responsibility
2. **Pattern Choice**: Teams can choose the most appropriate reactive pattern
3. **Backwards Compatibility**: Existing code continues to work
4. **Future-Proofing**: Easy to add new patterns or deprecate old ones
5. **Testing**: Each service can be tested independently
6. **Bundle Size**: Can tree-shake unused services in production

## Dependencies

All services depend on:

- `AzureAuthenticationFlowUtilsService` - Utility functions for PKCE and validation
- `SecureStorageService` - Secure storage for sensitive data
- `Environment` - Configuration injection token
- `AccessTokenResponse` - Interface for token responses

## Configuration

All services use the same configuration from the `Environment` injection token:

```typescript
interface AzureB2CConfig {
  tenant: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  policy: string;
  verifierLength: number;
}
```
