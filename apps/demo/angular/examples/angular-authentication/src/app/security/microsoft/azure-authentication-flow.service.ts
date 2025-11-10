import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AzureAuthenticationFlowSignalService } from './azure-authentication-flow-signal.service';
import { AzureAuthenticationFlowObservableService } from './azure-authentication-flow-observable.service';
import { AccessTokenResponse } from './azure-authentication-flow.interface';

/**
 * Facade service for handling Azure B2C authentication flow using PKCE (Proof Key for Code Exchange).
 * Provides access to both traditional Observable-based and modern Angular Signal-based authentication flows.
 *
 * This service acts as a unified interface that delegates to either:
 * - AzureAuthenticationFlowSignalService for signal-based reactive patterns
 * - AzureAuthenticationFlowObservableService for traditional observable patterns
 *
 * @example
 * ```typescript
 * constructor(private authService: AzureAuthenticationFlowService) {}
 *
 * // Using signal-based approach
 * ngOnInit() {
 *   effect(() => {
 *     const token = this.authService.signalService.accessToken();
 *     if (token) {
 *       console.log('User authenticated via signals:', token);
 *     }
 *   });
 * }
 *
 * // Using observable-based approach
 * ngOnInit() {
 *   this.authService.observableService.accessToken$.subscribe(token => {
 *     if (token) {
 *       console.log('User authenticated via observables:', token);
 *     }
 *   });
 * }
 *
 * login() {
 *   // Both services have the same login method
 *   this.authService.signalService.login();
 *   // OR
 *   this.authService.observableService.login();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AzureAuthenticationFlowService {
  /** Signal-based authentication service */
  readonly signalService = inject(AzureAuthenticationFlowSignalService);

  /** Observable-based authentication service */
  readonly observableService = inject(AzureAuthenticationFlowObservableService);

  /**
   * Constructor that provides access to both authentication service implementations.
   */
  constructor() {}
  /**
   * Convenience method to login using the signal-based service.
   * Delegates to the signal service login method.
   */
  login(): void {
    this.signalService.login();
  }

  /**
   * Convenience method to logout using both services.
   * Ensures both service states are cleared.
   */
  logout(): void {
    this.signalService.logout();
    this.observableService.logout();
  }

  /**
   * Convenience method to check authentication status using the signal-based service.
   *
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.signalService.isAuthenticated();
  }

  /**
   * Convenience method to get the current access token using the signal-based service.
   *
   * @returns {AccessTokenResponse | null} The current access token or null
   */
  getCurrentAccessToken(): AccessTokenResponse | null {
    return this.signalService.accessToken();
  }
}
