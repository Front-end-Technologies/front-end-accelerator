import {
  computed,
  effect,
  inject,
  Injectable,
  resource,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environment';
import { AzureAuthenticationFlowUtilsService } from './azure-authentication-flow-utils.service';
import { AccessTokenResponse } from './azure-authentication-flow.interface';
import { SecureStorageService } from '../secure-storage.service';

/**
 * Service for handling Azure B2C authentication flow using PKCE (Proof Key for Code Exchange).
 * Uses modern Angular Signal-based patterns for reactive state management.
 *
 * This service manages:
 * - PKCE code challenge generation
 * - OAuth authorization URL building
 * - Authorization code exchange for access tokens
 * - Secure storage of authentication state
 *
 * @example
 * ```typescript
 * constructor(private authService: AzureAuthenticationFlowSignalService) {}
 *
 * ngOnInit() {
 *   // Access token available via signal
 *   effect(() => {
 *     const token = this.authService.accessToken();
 *     if (token) {
 *       console.log('User authenticated:', token);
 *     }
 *   });
 * }
 *
 * login() {
 *   this.authService.login(); // Redirects to Azure B2C
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AzureAuthenticationFlowSignalService {
  #env = inject(Environment);
  #http = inject(HttpClient);
  #secureStorage = inject(SecureStorageService);
  #utils = inject(AzureAuthenticationFlowUtilsService);

  /** Signal containing the PKCE code verifier for the current authentication flow */
  readonly verifierSignal = signal<string>('');

  /** Signal containing the authorization code received from the OAuth redirect */
  readonly authCodeSignal = signal<string>('');

  /** Resource that generates the PKCE code challenge from the verifier */
  readonly challengeResource = resource({
    params: () => this.verifierSignal(),
    loader: ({ params }) =>
      this.#utils.generateCodeChallengeFromVerifier(params),
  });

  /** Resource that exchanges the authorization code for an access token */
  readonly accessTokenResource = rxResource({
    params: () => this.authCodeSignal(),
    stream: ({ params }) => this.#consumeAuthCode(params),
  });

  /** Computed signal containing the current PKCE challenge code */
  readonly challengeCode = computed(() => this.challengeResource.value() || '');

  /** Computed signal containing the current access token */
  readonly accessToken = computed(
    () => this.accessTokenResource.value() || null,
  );

  /** Computed signal indicating if the user is authenticated */
  readonly isAuthenticated = computed(() => {
    const token = this.accessToken();
    return !!token?.access_token;
  });

  /** Computed signal indicating if authentication is in progress */
  readonly isLoading = computed(() => {
    return (
      this.challengeResource.isLoading() || this.accessTokenResource.isLoading()
    );
  });

  /** Computed signal containing any authentication errors */
  readonly error = computed(() => {
    return this.challengeResource.error() || this.accessTokenResource.error();
  });

  refreshTimer$: Observable<number>;

  /**
   * Constructor that sets up the authentication flow.
   * Initializes effects for signal-based authentication and handles redirect callbacks.
   */
  constructor() {
    // Effect to handle automatic redirection when challenge is ready
    effect(() => {
      if (this.challengeResource.hasValue() && this.challengeCode()) {
        window.location.href = this.#buildLoginUrl();
      }
    });
    effect(() => {
      const token = this.accessToken();
      if (token) {
        // navigate to the home page and start refresh counter
      }
    });

    // Handle redirect callback on initialization
    this.#handleRedirectCallback();
  }

  /**
   * Builds the Azure B2C login URL with PKCE parameters.
   * Creates the authorization URL using the configured tenant, client ID, and PKCE challenge.
   *
   * @returns {string} The complete Azure B2C authorization URL
   */
  #buildLoginUrl(): string {
    const { tenant, clientId, redirectUri, scope, policy } = this.#env.azureB2C;
    const baseUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize`;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scope.join(' '),
      code_challenge: this.challengeCode(),
      code_challenge_method: 'S256',
    });
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   * Makes a POST request to the Azure B2C token endpoint using the PKCE flow.
   *
   * @param {string} code - The authorization code received from the redirect
   * @returns {Observable<AccessTokenResponse>} Observable containing the access token response
   */
  #consumeAuthCode(code: string): Observable<AccessTokenResponse> {
    if (!code) {
      return new Observable<AccessTokenResponse>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.#http.post<AccessTokenResponse>(
      `https://${this.#env.azureB2C.tenant}.b2clogin.com/${this.#env.azureB2C.tenant}.onmicrosoft.com/${this.#env.azureB2C.policy}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.#env.azureB2C.redirectUri,
        client_id: this.#env.azureB2C.clientId,
        code_verifier:
          this.#secureStorage.getSecureCookie('code_verifier') || '',
      }),
      { headers },
    );
  }

  /**
   * Signal-based version of the redirect callback handler.
   * Extracts authorization code from URL parameters and updates the authCodeSignal.
   * This triggers the reactive access token resource to fetch the token.
   */
  #handleRedirectCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return;
    }

    if (code && this.#utils.isValidAuthorizationCode(code)) {
      this.authCodeSignal.set(code);
    }
  }

  refreshAuthToken(): Observable<AccessTokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.#http.post<AccessTokenResponse>(
      `https://${this.#env.azureB2C.tenant}.b2clogin.com/${this.#env.azureB2C.tenant}.onmicrosoft.com/${this.#env.azureB2C.policy}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        scope: this.#env.azureB2C.scope.join(' '),
        refresh_token:
          this.#secureStorage.getSecureCookie('refresh_token') || '',
        client_id: this.#env.azureB2C.clientId,
        redirect_uri: this.#env.azureB2C.redirectUri,
      }),
      { headers },
    );
  }

  /**
   * Initiates the OAuth login flow by generating a PKCE verifier and redirecting to Azure B2C.
   * Generates a random code verifier, stores it securely, and triggers the login URL generation.
   */
  login(): void {
    const generatedVerifier = this.#utils.generateRandomString(
      this.#env.azureB2C.verifierLength,
    );
    this.verifierSignal.set(generatedVerifier);
    this.#secureStorage.setSecureCookie('code_verifier', generatedVerifier);
  }

  /**
   * Logs out the current user by clearing all authentication signals and stored state.
   */
  logout(): void {
    this.verifierSignal.set('');
    this.authCodeSignal.set('');
    this.#secureStorage.clearAuthData();

    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * Manually refresh the access token using the current authorization code.
   * Useful for refreshing expired tokens.
   */
  refreshToken(): void {
    const currentCode = this.authCodeSignal();
    if (currentCode) {
      // Trigger a refresh by re-setting the auth code signal
      this.authCodeSignal.set('');
      this.authCodeSignal.set(currentCode);
    }
  }
}
