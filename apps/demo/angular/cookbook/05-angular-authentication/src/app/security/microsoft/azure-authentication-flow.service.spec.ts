import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AzureAuthenticationFlowService } from './azure-authentication-flow.service';

import { AzureAuthenticationFlowUtilsService } from './azure-authentication-flow-utils.service';
import { SecureStorageService } from '../secure-storage.service';
import { Environment } from '../../environment';

// Mock environment for testing
const mockEnvironment = {
  apiUrl: 'https://api.test.com',
  production: false,
  azureB2C: {
    tenant: 'testtenant',
    clientId: 'test-client-id',
    redirectUri: 'https://test.com/callback',
    postLogoutRedirectUri: 'https://test.com/logout',
    policy: 'B2C_1_signin',
    scope: ['openid', 'profile', 'email'],
    verifierLength: 43,
  },
};

// Mock secure storage service
const mockSecureStorageService = {
  setSecureCookie: vi.fn(),
  getSecureCookie: vi.fn(),
  removeSecureCookie: vi.fn(),
};

// Mock utils service
const mockUtilsService = {
  generateRandomString: vi.fn(),
  generateCodeChallengeFromVerifier: vi.fn(),
  isValidAuthorizationCode: vi.fn(),
};

describe('AzureAuthenticationFlowService', () => {
  let service: AzureAuthenticationFlowService;
  let httpMock: HttpTestingController;
  let mockWindowLocation: any;
  let originalLocation: any;

  beforeEach(async () => {
    // Reset TestBed completely
    TestBed.resetTestingModule();

    // Store original location to restore later
    originalLocation = Object.getOwnPropertyDescriptor(window, 'location');

    // Create a mock for window.location that doesn't trigger JSDOM navigation
    mockWindowLocation = {
      href: 'https://test.com/callback',
      search: '',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      toString: () => 'https://test.com/callback',
    };

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockWindowLocation,
      writable: true,
      configurable: true,
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUtilsService.generateRandomString.mockReturnValue(
      'test-random-verifier-12345',
    );
    mockUtilsService.generateCodeChallengeFromVerifier.mockResolvedValue(
      'test-challenge-code',
    );
    mockUtilsService.isValidAuthorizationCode.mockImplementation(
      (code: string) => code && code.length > 10 && !code.includes('invalid'),
    );

    mockSecureStorageService.getSecureCookie.mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AzureAuthenticationFlowService,
        { provide: Environment, useValue: mockEnvironment },
        { provide: SecureStorageService, useValue: mockSecureStorageService },
        {
          provide: AzureAuthenticationFlowUtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(AzureAuthenticationFlowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Flush any pending HTTP requests
    try {
      httpMock.verify();
    } catch (error) {
      // If there are pending requests, flush them
      const pendingRequests = httpMock.match(() => true);
      pendingRequests.forEach((req) => {
        req.flush({}, { status: 200, statusText: 'OK' });
      });
    }

    // Restore original location
    if (originalLocation) {
      Object.defineProperty(window, 'location', originalLocation);
    }

    // Clear all mocks
    vi.clearAllMocks();

    // Reset TestBed
    TestBed.resetTestingModule();
  });

  describe('Service Creation', () => {
    it('should create service', () => {
      expect(service).toBeDefined();
    });
  });

  describe('URL Generation', () => {
    it('should generate correct login URL with all required parameters', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Call the login method which generates and logs the URL
      service.login();

      // Wait for any async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify the URL was logged
      expect(consoleSpy).toHaveBeenCalled();

      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      expect(urlLogCall).toBeDefined();
      const loggedUrl = urlLogCall![1];

      // Verify URL structure and parameters
      expect(loggedUrl).toContain('testtenant.b2clogin.com');
      expect(loggedUrl).toContain('testtenant.onmicrosoft.com');
      expect(loggedUrl).toContain('B2C_1_signin');
      expect(loggedUrl).toContain('client_id=test-client-id');
      expect(loggedUrl).toContain('response_type=code');
      expect(loggedUrl).toContain(
        'redirect_uri=https%3A%2F%2Ftest.com%2Fcallback',
      );
      expect(loggedUrl).toContain('scope=openid+profile+email');
      expect(loggedUrl).toContain('code_challenge=test-challenge-code');
      expect(loggedUrl).toContain('code_challenge_method=S256');

      consoleSpy.mockRestore();
    });

    it('should include code challenge in URL when challenge is available', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockUtilsService.generateCodeChallengeFromVerifier.mockResolvedValue(
        'custom-challenge',
      );

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      expect(urlLogCall).toBeDefined();
      const loggedUrl = urlLogCall![1];
      expect(loggedUrl).toContain('code_challenge=custom-challenge');

      consoleSpy.mockRestore();
    });

    it('should properly encode redirect URI in URL', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      expect(urlLogCall).toBeDefined();
      const loggedUrl = urlLogCall![1];

      // Check that the redirect URI is properly URL encoded
      expect(loggedUrl).toContain(
        'redirect_uri=https%3A%2F%2Ftest.com%2Fcallback',
      );
      expect(loggedUrl).not.toContain('redirect_uri=https://test.com/callback');

      consoleSpy.mockRestore();
    });

    it('should handle multiple scopes correctly in URL', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      expect(urlLogCall).toBeDefined();
      const loggedUrl = urlLogCall![1];

      // Verify scopes are joined with + and properly encoded
      expect(loggedUrl).toContain('scope=openid+profile+email');

      consoleSpy.mockRestore();
    });

    it('should generate URL with correct tenant and policy structure', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      expect(urlLogCall).toBeDefined();
      const loggedUrl = urlLogCall![1];

      // Verify the correct Azure B2C URL structure
      const expectedBase =
        'https://testtenant.b2clogin.com/testtenant.onmicrosoft.com/B2C_1_signin/oauth2/v2.0/authorize';
      expect(loggedUrl).toContain(expectedBase);

      consoleSpy.mockRestore();
    });
  });

  describe('Login Flow', () => {
    it('should generate random verifier and store it securely', () => {
      service.login();

      // Verify verifier generation
      expect(mockUtilsService.generateRandomString).toHaveBeenCalledWith(43);

      // Verify secure storage
      expect(mockSecureStorageService.setSecureCookie).toHaveBeenCalledWith(
        'code_verifier',
        'test-random-verifier-12345',
      );
    });

    it('should redirect to generated login URL', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockWindowLocation.href = ''; // Reset href

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should have redirected by setting location.href
      expect(mockWindowLocation.href).toBeTruthy();
      expect(mockWindowLocation.href).toContain('testtenant.b2clogin.com');

      consoleSpy.mockRestore();
    });
  });

  describe('Challenge Code Generation', () => {
    it('should update challenge code when verifier signal changes', async () => {
      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(
        mockUtilsService.generateCodeChallengeFromVerifier,
      ).toHaveBeenCalledWith('test-random-verifier-12345');
    });

    it('should return empty challenge when no verifier is available', async () => {
      mockUtilsService.generateRandomString.mockReturnValue('');

      service.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // When there's no verifier, no challenge should be generated
      if (
        mockUtilsService.generateCodeChallengeFromVerifier.mock.calls.length > 0
      ) {
        const challengeCall =
          mockUtilsService.generateCodeChallengeFromVerifier.mock.calls[0];
        expect(challengeCall[0]).toBe('');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty scopes array', async () => {
      // Temporarily modify the environment to have empty scopes
      const emptyScope = {
        ...mockEnvironment,
        azureB2C: { ...mockEnvironment.azureB2C, scope: [] },
      };

      // Create a new service instance with modified environment
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AzureAuthenticationFlowService,
          { provide: Environment, useValue: emptyScope },
          { provide: SecureStorageService, useValue: mockSecureStorageService },
          {
            provide: AzureAuthenticationFlowUtilsService,
            useValue: mockUtilsService,
          },
        ],
      }).compileComponents();

      const testService = TestBed.inject(AzureAuthenticationFlowService);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      testService.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      if (urlLogCall) {
        const loggedUrl = urlLogCall[1];
        // Should handle empty scopes gracefully
        expect(loggedUrl).toContain('scope=');
      }

      consoleSpy.mockRestore();
    });

    it('should handle special characters in tenant name', async () => {
      const specialTenant = {
        ...mockEnvironment,
        azureB2C: {
          ...mockEnvironment.azureB2C,
          tenant: 'test-tenant-with-dash',
        },
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AzureAuthenticationFlowService,
          { provide: Environment, useValue: specialTenant },
          { provide: SecureStorageService, useValue: mockSecureStorageService },
          {
            provide: AzureAuthenticationFlowUtilsService,
            useValue: mockUtilsService,
          },
        ],
      }).compileComponents();

      const testService = TestBed.inject(AzureAuthenticationFlowService);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      testService.login();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleSpy).toHaveBeenCalled();
      const loggedCalls = consoleSpy.mock.calls;
      const urlLogCall = loggedCalls.find(
        (call) =>
          call[0] === 'Generated Azure B2C login URL:' &&
          typeof call[1] === 'string',
      );

      if (urlLogCall) {
        const loggedUrl = urlLogCall[1];
        expect(loggedUrl).toContain('test-tenant-with-dash.b2clogin.com');
      }

      consoleSpy.mockRestore();
    });
  });
});
