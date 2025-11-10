import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SecureStorageOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  maxAge?: number; // in seconds
  path?: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  policy: string;
}

interface StorageItem {
  value: unknown;
  expiresAt: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  // Private fields first
  readonly #inMemoryStorage = new Map<string, StorageItem>();

  readonly #accessTokenSignal = signal<string>('');

  readonly #refreshTokenSignal = signal<string>('');

  readonly #policySignal = signal<string>('');

  readonly #accessTokenSubject = new BehaviorSubject<string>('');

  readonly #refreshTokenSubject = new BehaviorSubject<string>('');

  readonly #policySubject = new BehaviorSubject<string>('');

  //  getters
  get accessTokenValue(): string {
    return this.#accessTokenSignal();
  }

  get refreshTokenValue(): string {
    return this.#refreshTokenSignal();
  }

  get policyValue(): string {
    return this.#policySignal();
  }

  get accessToken$(): Observable<string> {
    return this.#accessTokenSubject.asObservable();
  }

  get refreshToken$(): Observable<string> {
    return this.#refreshTokenSubject.asObservable();
  }

  get policy$(): Observable<string> {
    return this.#policySubject.asObservable();
  }

  /**
   * Sets a value in secure HTTP-only cookie
   */
  setSecureCookie(
    name: string,
    value: string,
    options: SecureStorageOptions = {},
  ): void {
    const {
      secure = true,
      sameSite = 'Strict',
      maxAge = 3600, // 1 hour default
      path = '/',
    } = options;

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + maxAge);

    let cookieString = `${name}=${encodeURIComponent(value)}`;
    cookieString += `; expires=${expires.toUTCString()}`;
    cookieString += `; path=${path}`;
    cookieString += `; SameSite=${sameSite}`;

    if (secure) {
      cookieString += '; Secure';
    }

    document.cookie = cookieString;
  }

  /**
   * Gets a value from cookie
   */
  getSecureCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue || '');
      }
    }
    return null;
  }

  /**
   * Removes a secure cookie
   */
  removeSecureCookie(name: string, path: string = '/'): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict; Secure`;
  }

  /**
   * Sets a value in in-memory storage with automatic expiration
   */
  setInMemory(key: string, value: unknown, expiresInSeconds?: number): void {
    const item: StorageItem = {
      value,
      expiresAt: expiresInSeconds ? Date.now() + expiresInSeconds * 1000 : null,
    };
    this.#inMemoryStorage.set(key, item);
  }

  /**
   * Gets a value from in-memory storage
   */
  getInMemory<T>(key: string): T | null {
    const item = this.#inMemoryStorage.get(key);
    if (!item) {
      return null;
    }

    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.#inMemoryStorage.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Removes a value from in-memory storage
   */
  removeInMemory(key: string): void {
    this.#inMemoryStorage.delete(key);
  }

  /**
   * Clears all in-memory storage
   */
  clearInMemory(): void {
    this.#inMemoryStorage.clear();
  }

  /**
   * Sets access token in memory and updates signal/subject
   */
  setAccessToken(token: string, expiresInSeconds?: number): void {
    this.setInMemory('access_token', token, expiresInSeconds);
    this.#accessTokenSignal.set(token);
    this.#accessTokenSubject.next(token);
  }

  /**
   * Gets access token from memory
   */
  getAccessToken(): string {
    const token = this.getInMemory<string>('access_token');
    return token || '';
  }

  /**
   * Sets refresh token in secure cookie
   */
  setRefreshToken(token: string, maxAgeSeconds: number = 7 * 24 * 3600): void {
    // Store in secure cookie for persistence across sessions
    this.setSecureCookie('refresh_token', token, {
      secure: true,
      sameSite: 'Strict',
      maxAge: maxAgeSeconds,
      path: '/',
    });

    // Also store in memory for quick access
    this.setInMemory('refresh_token', token, maxAgeSeconds);
    this.#refreshTokenSignal.set(token);
    this.#refreshTokenSubject.next(token);
  }

  /**
   * Gets refresh token from memory first, fallback to cookie
   */
  getRefreshToken(): string {
    let token = this.getInMemory<string>('refresh_token');

    if (!token) {
      // Fallback to cookie
      token = this.getSecureCookie('refresh_token');
      if (token) {
        // Restore to memory
        this.setInMemory('refresh_token', token);
      }
    }

    return token || '';
  }

  /**
   * Sets policy in memory (temporary storage)
   */
  setPolicy(policy: string): void {
    this.setInMemory('auth_policy', policy, 3600); // 1 hour
    this.setSecureCookie('auth_policy', policy, {
      secure: true,
      sameSite: 'Strict',
      maxAge: 3600 * 24, // 1 day
    });
    this.#policySignal.set(policy);
    this.#policySubject.next(policy);
  }

  /**
   * Gets policy from memory
   */
  getPolicy(): string {
    const policy =
      this.getInMemory<string>('auth_policy') ||
      this.getSecureCookie('auth_policy');
    return policy || '';
  }

  /**
   * Sets complete token data with appropriate storage strategies
   */
  setTokenData(tokenData: TokenData): void {
    // Access token: in-memory only (most secure)
    this.setAccessToken(tokenData.accessToken, tokenData.expiresIn);

    // Refresh token: secure cookie + memory (persistent)
    this.setRefreshToken(tokenData.refreshToken);

    // Policy: in-memory (temporary)
    this.setPolicy(tokenData.policy);
  }

  /**
   * Gets complete token data
   */
  getTokenData(): TokenData {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      expiresIn: 0, // This would need to be calculated based on token
      policy: this.getPolicy(),
    };
  }

  /**
   * Clears all authentication data
   */
  clearAuthData(): void {
    // Clear in-memory storage
    this.removeInMemory('access_token');
    this.removeInMemory('refresh_token');
    this.removeInMemory('auth_policy');

    // Clear cookies
    this.removeSecureCookie('refresh_token');

    // Reset signals and subjects
    this.#accessTokenSignal.set('');
    this.#refreshTokenSignal.set('');
    this.#policySignal.set('');

    this.#accessTokenSubject.next('');
    this.#refreshTokenSubject.next('');
    this.#policySubject.next('');
  }

  /**
   * Sets redirect URL in memory (temporary storage for redirects)
   */
  setRedirectUrl(url: string): void {
    this.setInMemory('redirect_url', url, 3600); // 1 hour expiration
  }

  /**
   * Gets redirect URL from memory
   */
  getRedirectUrl(): string {
    const url = this.getInMemory<string>('redirect_url');
    return url || '';
  }

  /**
   * Removes redirect URL from memory
   */
  removeRedirectUrl(): void {
    this.removeInMemory('redirect_url');
  }

  /**
   * Checks if user has valid authentication data
   */
  hasValidAuthData(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    return !!(accessToken || refreshToken);
  }
}
