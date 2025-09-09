import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AzureAuthenticationFlowService,
  AzureAuthenticationFlowSignalService,
  AzureAuthenticationFlowObservableService,
} from './index';
import { AccessTokenResponse } from './azure-authentication-flow.interface';

/**
 * Example component demonstrating how to use both signal-based and observable-based
 * Azure authentication services.
 */
@Component({
  selector: 'app-authentication-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <h2>Azure B2C Authentication Example</h2>

      <!-- Facade Service Example -->
      <div class="service-section">
        <h3>Facade Service (Recommended)</h3>
        <button
          (click)="loginWithFacade()"
          [disabled]="isAuthenticatedFacade()"
        >
          Login with Facade Service
        </button>
        <button
          (click)="logoutWithFacade()"
          [disabled]="!isAuthenticatedFacade()"
        >
          Logout
        </button>
        <p>
          Status:
          {{ isAuthenticatedFacade() ? 'Authenticated' : 'Not Authenticated' }}
        </p>
        <p *ngIf="facadeAccessToken()">
          Token: {{ facadeAccessToken()?.access_token | slice: 0 : 50 }}...
        </p>
      </div>

      <hr />

      <!-- Signal Service Example -->
      <div class="service-section">
        <h3>Signal-Based Service</h3>
        <button
          (click)="loginWithSignals()"
          [disabled]="signalService.isAuthenticated()"
        >
          Login with Signals
        </button>
        <button
          (click)="logoutWithSignals()"
          [disabled]="!signalService.isAuthenticated()"
        >
          Logout
        </button>
        <p>
          Status:
          {{
            signalService.isAuthenticated()
              ? 'Authenticated'
              : 'Not Authenticated'
          }}
        </p>
        <p>Loading: {{ signalService.isLoading() ? 'Yes' : 'No' }}</p>
        <p *ngIf="signalService.accessToken()">
          Token:
          {{ signalService.accessToken()?.access_token | slice: 0 : 50 }}...
        </p>
        <p *ngIf="signalService.error()" class="error">
          Error: {{ signalService.error() }}
        </p>
      </div>

      <hr />

      <!-- Observable Service Example -->
      <div class="service-section">
        <h3>Observable-Based Service</h3>
        <button
          (click)="loginWithObservables()"
          [disabled]="observableIsAuthenticated"
        >
          Login with Observables
        </button>
        <button
          (click)="logoutWithObservables()"
          [disabled]="!observableIsAuthenticated"
        >
          Logout
        </button>
        <p>
          Status:
          {{
            observableIsAuthenticated ? 'Authenticated' : 'Not Authenticated'
          }}
        </p>
        <p *ngIf="observableAccessToken">
          Token: {{ observableAccessToken.access_token | slice: 0 : 50 }}...
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .service-section {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }

      button {
        margin: 5px;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        background-color: #007acc;
        color: white;
        cursor: pointer;
      }

      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      button:hover:not(:disabled) {
        background-color: #005a9e;
      }

      .error {
        color: red;
        font-weight: bold;
      }

      hr {
        margin: 30px 0;
        border: none;
        border-top: 1px solid #ddd;
      }
    `,
  ],
})
export class AuthenticationExampleComponent implements OnInit {
  // Inject all three services
  readonly facadeService = inject(AzureAuthenticationFlowService);
  readonly signalService = inject(AzureAuthenticationFlowSignalService);
  readonly observableService = inject(AzureAuthenticationFlowObservableService);

  // Observable-based properties
  observableIsAuthenticated = false;
  observableAccessToken: AccessTokenResponse | null = null;

  // Computed signals for facade service (delegates to signal service)
  readonly isAuthenticatedFacade =
    this.facadeService.signalService.isAuthenticated;
  readonly facadeAccessToken = this.facadeService.signalService.accessToken;

  constructor() {
    // Signal-based effect for debugging
    effect(() => {
      const token = this.signalService.accessToken();
      const isAuth = this.signalService.isAuthenticated();
      const isLoading = this.signalService.isLoading();
      const error = this.signalService.error();

      console.log('Signal Service State:', {
        isAuthenticated: isAuth,
        hasToken: !!token,
        isLoading,
        error,
      });
    });
  }

  ngOnInit() {
    // Observable-based subscriptions
    this.observableService.accessToken$.subscribe((token) => {
      this.observableAccessToken = token;
      console.log('Observable Service - Access Token:', token);
    });

    this.observableService.accessToken$.subscribe((token) => {
      this.observableIsAuthenticated = this.observableService.isAuthenticated();
      console.log(
        'Observable Service - Is Authenticated:',
        this.observableIsAuthenticated,
      );
    });
  }

  // Facade service methods
  loginWithFacade() {
    console.log('Logging in with Facade Service...');
    this.facadeService.login();
  }

  logoutWithFacade() {
    console.log('Logging out with Facade Service...');
    this.facadeService.logout();
  }

  // Signal service methods
  loginWithSignals() {
    console.log('Logging in with Signal Service...');
    this.signalService.login();
  }

  logoutWithSignals() {
    console.log('Logging out with Signal Service...');
    this.signalService.logout();
  }

  // Observable service methods
  async loginWithObservables() {
    console.log('Logging in with Observable Service...');
    await this.observableService.login();
  }

  logoutWithObservables() {
    console.log('Logging out with Observable Service...');
    this.observableService.logout();
  }
}
