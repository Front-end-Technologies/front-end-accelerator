export abstract class Environment {
  abstract readonly apiUrl: string;
  abstract readonly production: boolean;

  // Auth-related configuration
  abstract readonly azureB2C: {
    tenant: string;
    clientId: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
    policy: string;
    scope: string[];
    verifierLength: number;
  };
}
