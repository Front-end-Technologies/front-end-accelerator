import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, EMPTY, switchMap, tap } from 'rxjs';
import { Environment } from '../../environment';

import { AzureAuthenticationFlowUtilsService } from './azure-authentication-flow-utils.service';
import { AccessTokenResponse } from './azure-authentication-flow.interface';
import { SecureStorageService } from '../secure-storage.service';

/**
 * Service for handling Azure B2C authentication flow using PKCE (Proof Key for Code Exchange).
 * Uses traditional Observable-based patterns for reactive programming.
 *
 * This service manages:
 * - PKCE code challenge generation
 * - OAuth authorization URL building
 * - Authorization code exchange for access tokens
 * - Secure storage of authentication state
 *
 * @example
 * ```typescript
 * constructor(private authService: AzureAuthenticationFlowObservableService) {}
 *
 * ngOnInit() {
 *   this.authService.accessToken$.subscribe(token => {
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
export class AzureAuthenticationFlowObservableService {
  #env = inject(Environment);
  #http = inject(HttpClient);
  #secureStorage = inject(SecureStorageService);
  #utils = inject(AzureAuthenticationFlowUtilsService);

  /** BehaviorSubject containing the current PKCE code verifier */
  private readonly verifierSubject = new BehaviorSubject<string>('');

  /** BehaviorSubject containing the current authorization code */
  private readonly authCodeSubject = new BehaviorSubject<string>('');

  /** BehaviorSubject containing the current access token */
  private readonly accessTokenSubject =
    new BehaviorSubject<AccessTokenResponse | null>(null);

  /** Observable stream of the PKCE code verifier */
  readonly verifier$ = this.verifierSubject.asObservable();

  /** Observable stream of the authorization code */
  readonly authCode$ = this.authCodeSubject.asObservable();

  /** Observable stream of the access token */
  readonly accessToken$ = this.accessTokenSubject.asObservable();

  /**
   * Constructor that sets up the authentication flow.
   * Handles redirect callback and sets up reactive streams.
   */
  constructor() {
    this.#handleRedirectCallback();
    this.#setupTokenFlow();
  }

  /**
   * Sets up the reactive token flow.
   * Automatically exchanges authorization codes for access tokens when received.
   */
  #setupTokenFlow(): void {
    this.authCode$
      .pipe(
        switchMap((code) => (code ? this.#consumeAuthCode(code) : EMPTY)),
        tap((token) => this.accessTokenSubject.next(token)),
      )
      .subscribe();
  }

  /**
   * Generates the PKCE code challenge from a verifier.
   *
   * @param {string} verifier - The PKCE code verifier
   * @returns {Promise<string>} Promise resolving to the code challenge
   */
  async #generateCodeChallenge(verifier: string): Promise<string> {
    return this.#utils.generateCodeChallengeFromVerifier(verifier);
  }

  /**
   * Builds the Azure B2C login URL with PKCE parameters.
   * Creates the authorization URL using the configured tenant, client ID, and PKCE challenge.
   *
   * @param {string} codeChallenge - The PKCE code challenge
   * @returns {string} The complete Azure B2C authorization URL
   */
  #buildLoginUrl(codeChallenge: string): string {
    const { tenant, clientId, redirectUri, scope, policy } = this.#env.azureB2C;
    const baseUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize`;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scope.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    console.log(
      'Generated Azure B2C login URL:',
      `${baseUrl}?${params.toString()}`,
    );
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
   * Handles the OAuth redirect callback by extracting the authorization code from URL parameters.
   * Validates and processes the authorization code if present, or handles errors.
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
      this.authCodeSubject.next(code);
    }
  }

  /**
   * Initiates the OAuth login flow by generating a PKCE verifier and redirecting to Azure B2C.
   * Generates a random code verifier, stores it securely, and redirects to the authorization URL.
   */
  async login(): Promise<void> {
    const generatedVerifier = this.#utils.generateRandomString(
      this.#env.azureB2C.verifierLength,
    );

    this.verifierSubject.next(generatedVerifier);
    this.#secureStorage.setSecureCookie('code_verifier', generatedVerifier);

    const codeChallenge = await this.#generateCodeChallenge(generatedVerifier);
    const loginUrl = this.#buildLoginUrl(codeChallenge);

    window.location.href = loginUrl;
  }

  /**
   * Logs out the current user by clearing stored tokens and authentication state.
   */
  logout(): void {
    this.accessTokenSubject.next(null);
    this.authCodeSubject.next('');
    this.verifierSubject.next('');
    this.#secureStorage.setSecureCookie('code_verifier', '');
  }

  /**
   * Gets the current access token synchronously.
   *
   * @returns {AccessTokenResponse | null} The current access token or null
   */
  getCurrentAccessToken(): AccessTokenResponse | null {
    return this.accessTokenSubject.value;
  }

  /**
   * Checks if the user is currently authenticated.
   *
   * @returns {boolean} True if user has a valid access token
   */
  isAuthenticated(): boolean {
    const token = this.getCurrentAccessToken();
    return !!token?.access_token;
  }
}
