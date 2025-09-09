import { Environment } from '../environment';

export const environment: Environment = {
  apiUrl: 'https://api.example.com',
  production: false,
  azureB2C: {
    tenant: 'BridgestoneB2C',
    clientId: '0f20c44e-d902-488f-8d13-da21f2f6763c',
    scope: ['openid'],
    redirectUri: 'https://localhost:5555/signin',
    postLogoutRedirectUri: 'https://localhost:5555/',
    policy: 'B2C_1A_FLEETBRIDGE_SIGNIN_DEV',
    verifierLength: 43,
  },
};
