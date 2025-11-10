export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  not_before: number;
  expires_in: number;
  expires_on: number;
  resource: string;
  profile_info: string;
  scope: string;
  refresh_token: string;
  refresh_token_expires_in: number;
}
