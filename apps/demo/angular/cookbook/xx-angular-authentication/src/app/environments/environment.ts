import { Environment } from '../environment';

export const environment: Environment = {
  apiUrl: 'https://api.example.com',
  production: false,
  azureB2C: {
    tenant: 'your-tenant-id',
    clientId: 'your-client-id',
    scope: ['openid', 'profile', 'email'],
    redirectUri: 'https://your-app.com/callback',
    postLogoutRedirectUri: 'https://your-app.com/',
    policy: 'your-policy',
    verifierLength: 43,
  },
};
