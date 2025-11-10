import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Environment } from '../../environment';
import { AccessTokenResponse, AzureAuthenticationFlowUtilsService } from '.';
@Component({
  selector: 'app-silent-callback',
  template: '',
  standalone: false,
})
export class SilentCallbackComponent {
  #route = inject(ActivatedRoute);
  #utils = inject(AzureAuthenticationFlowUtilsService);
  #env = inject(Environment);
  constructor() {
    const { fragment } = this.#route.snapshot;
    const params = new URLSearchParams(fragment ?? '');
    const accessToken = params.get('access_token');

    if (accessToken) {
      window.opener.postMessage(
        { access_token: accessToken },
        window.location.origin,
      );
      window.close();
    }
  }

  getSilentAccessToken(): Observable<AccessTokenResponse> {
    return new Observable<AccessTokenResponse>((observer) => {
      // Validate environment configuration before proceeding
      if (!this.#utils.validateEnvironmentConfig()) {
        observer.error('AUTH_ENVIRONMENT_CONFIG_INVALID');
        return () => {}; // Return empty cleanup function
      }

      const policy = this.#env.azureB2C.policy;
      const clientId = this.#env.azureB2C.clientId;
      const redirectUri = encodeURIComponent(this.#env.azureB2C.redirectUri);
      const scope = `https://${this.#env.azureB2C.tenant}.onmicrosoft.com/${this.#env.azureB2C.clientId}/access`;

      // Validate all required parameters
      if (!policy || !clientId || !this.#env.azureB2C.tenant) {
        observer.error('AUTH_MISSING_REQUIRED_CONFIG');
        return () => {}; // Return empty cleanup function
      }

      const url =
        `https://${this.#env.azureB2C.tenant}.b2clogin.com/${this.#env.azureB2C.tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize?` +
        `client_id=${clientId}` +
        '&response_type=token' +
        `&redirect_uri=${redirectUri}` +
        `&scope=${encodeURIComponent(scope)}` +
        '&prompt=none';

      const iframe = document.createElement('iframe');
      let timeoutId: number;
      let isCompleted = false;
      let messageHandler: ((event: MessageEvent) => void) | null = null;

      // Define cleanup function
      const cleanup = (): void => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (messageHandler) {
          window.removeEventListener('message', messageHandler);
          messageHandler = null;
        }
        if (iframe && iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      };

      // Create message handler
      messageHandler = (event: MessageEvent): void => {
        // Enhanced origin validation
        if (!this.#utils.isValidOrigin(event.origin)) {
          this.#utils.handleAuthenticationError(
            { message: 'Invalid message origin', origin: event.origin },
            'Silent token acquisition',
          );
          return;
        }

        if (isCompleted) {
          return; // Prevent multiple completions
        }

        // Validate response data structure
        if (this.#utils.isValidTokenResponse(event.data)) {
          isCompleted = true;
          cleanup();
          observer.next(event.data);
          observer.complete();
        } else if (event.data?.error) {
          isCompleted = true;
          cleanup();
          observer.error('AUTH_SILENT_TOKEN_FAILED');
        }
      };

      const handleTimeout = (): void => {
        if (!isCompleted) {
          isCompleted = true;
          cleanup();
          observer.error('AUTH_SILENT_TOKEN_TIMEOUT');
        }
      };

      // Set iframe security attributes
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      // allow-scripts is necessary for the iframe to execute scripts with azure b2c
      // allow-same-origin is necessary for the iframe to access cookies and local storage
      // allow-forms is necessary for the iframe to submit forms
      iframe.setAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-forms',
      );
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('referrerpolicy', 'no-referrer');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('importance', 'low');
      iframe.setAttribute('fetchpriority', 'low');
      // Prevent iframe from being navigated by external scripts
      iframe.setAttribute('allow', 'same-origin');
      // Set a unique name to prevent targeting by malicious scripts
      iframe.name = `auth-iframe-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      iframe.src = url;

      // Set up timeout (30 seconds)
      timeoutId = window.setTimeout(handleTimeout, 30000);

      // Add event listener before appending iframe
      window.addEventListener('message', messageHandler);

      try {
        document.body.appendChild(iframe);
      } catch (error) {
        cleanup();
        observer.error('AUTH_IFRAME_CREATION_FAILED');
        return () => {}; // Return empty cleanup function
      }
      return cleanup;
    });
  }
}
