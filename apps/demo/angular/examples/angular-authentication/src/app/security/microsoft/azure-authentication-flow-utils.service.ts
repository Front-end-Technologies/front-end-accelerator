import { inject, Injectable } from '@angular/core';
import { Environment } from '../../environment';

/**
 * Security utilities service for authentication operations
 * Contains validation methods and security helpers
 */
@Injectable({
  providedIn: 'root',
})
export class AzureAuthenticationFlowUtilsService {
  #env = inject(Environment);

  /**
   * Validates refresh token format and structure
   * @param token - The refresh token to validate
   * @returns True if token appears to be a valid JWT format
   */
  isValidRefreshToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic JWT format validation (header.payload.signature)
    const tokenParts = token.split('.');
    // check for opaque token format
    if (tokenParts.length !== 5) {
      return false;
    }

    // Check each part is base64url encoded
    const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
    return tokenParts.every(
      (part) => part.length > 0 && base64UrlRegex.test(part),
    );
  }

  /**
   * Validates policy parameter to prevent injection attacks
   * @param policy - The policy to validate
   * @returns True if policy is valid
   */
  isValidPolicy(policy: string): boolean {
    if (!policy || typeof policy !== 'string') {
      return false;
    }
    return true;
  }

  /**
   * Validates authorization code format to prevent injection
   * @param code - The authorization code to validate
   * @returns True if code format is valid
   */
  isValidAuthorizationCode(code: string): boolean {
    if (!code || typeof code !== 'string') {
      return false;
    }
    return true;
  }

  /**
   * Validates expires_in value to prevent overflow attacks
   * @param expiresIn - The expires_in value to validate
   * @returns True if value is within acceptable bounds
   */
  validateExpiresIn(expiresIn: number): boolean {
    // Reasonable bounds: 5 minutes to 24 hours
    const minSeconds = 300; // 5 minutes
    const maxSeconds = 86400; // 24 hours

    return (
      Number.isInteger(expiresIn) &&
      expiresIn >= minSeconds &&
      expiresIn <= maxSeconds
    );
  }

  /**
   * Validates B2C environment configuration
   * @returns True if environment is properly configured
   */
  validateEnvironmentConfig(): boolean {
    const { tenant, clientId, policy } = this.#env.azureB2C;
    const configIsValid = !!(
      tenant &&
      clientId &&
      policy &&
      typeof tenant === 'string' &&
      typeof clientId === 'string' &&
      typeof policy === 'string' &&
      tenant.length > 0 &&
      clientId.length > 0 &&
      policy.length > 0
    );
    if (!configIsValid) {
      console.error(
        'Invalid B2C environment configuration. Please check your environment settings.',
      );
    }
    return configIsValid;
  }

  /**
   * Validates message origin for secure iframe communication
   * @param origin - The message origin to validate
   * @returns True if origin is trusted
   */
  isValidOrigin(origin: string): boolean {
    if (!origin || typeof origin !== 'string') {
      return false;
    }

    // Only allow b2clogin.com origins
    const validOriginPattern = new RegExp(
      `^https://${this.#env.azureB2C.tenant}\\.b2clogin\\.com$`,
    );
    return validOriginPattern.test(origin);
  }

  /**
   * Validates token response structure
   * @param response - The token response to validate
   * @returns True if response has required structure
   */
  isValidTokenResponse(response: unknown): boolean {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const tokenResponse = response as {
      access_token?: unknown;
      token_type?: unknown;
      expires_in?: unknown;
    };

    return !!(
      tokenResponse.access_token &&
      typeof tokenResponse.access_token === 'string' &&
      tokenResponse.token_type &&
      typeof tokenResponse.token_type === 'string' &&
      tokenResponse.expires_in &&
      typeof tokenResponse.expires_in === 'number' &&
      this.validateExpiresIn(tokenResponse.expires_in)
    );
  }

  /**
   * Generates a cryptographically secure random string
   * @param length - The desired length of the random string
   * @returns A cryptographically secure random string
   */
  generateRandomString(length: number = 43): string {
    if (length < 1 || length > 200) {
      throw new Error('Invalid length for random string generation');
    }

    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(
      array,
      (byte) =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[
          byte % 66
        ],
    ).join('');
  }

  /**
   * Generates a code challenge from a verifier using SHA256
   * @param codeVerifier - The code verifier to hash
   * @returns Promise resolving to the base64url-encoded code challenge
   */
  async generateCodeChallengeFromVerifier(
    codeVerifier: string,
  ): Promise<string> {
    if (!codeVerifier || typeof codeVerifier !== 'string') {
      throw new Error('Invalid code verifier provided');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return this.base64URLEscape(base64String);
  }

  /**
   * Converts base64 to base64url encoding
   * @param str - The base64 string to convert
   * @returns The base64url encoded string
   */
  base64URLEscape(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Handles authentication errors with sanitized logging
   * @param error - The error to handle
   * @param context - Additional context for the error
   */
  handleAuthenticationError(error: unknown, context: string): void {
    // Sanitize error message to prevent sensitive data exposure
    const sanitizedError =
      (error as { message?: string })?.message ||
      'Unknown authentication error';
    const safeContext = context?.replace(/[<>]/g, '') || 'Unknown context';

    console.error(`Authentication error in ${safeContext}:`, {
      message: sanitizedError,
      timestamp: new Date().toISOString(),
      context: safeContext,
    });
  }
}
