// configure session from server
export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      // customise the session data, stored in cookies, http only and secure
      // !IMPORTANT Since we encrypt and store session data in cookies, we're constrained by the 4096-byte cookie size limit. Store only essential information.
      user: {
        githubId: user.id,
        login: user.login,
        roles: ['user','admin'],
      },
      // Private data accessible only on server/routes DO THIS!!!
      secure: {
        accessToken: `${tokens.token_type} ${tokens.access_token}`,
        roles: ['secret-role-supervisor, secret-role-ultra-admin'],
      },
      // for demo purposes, we're storing the fake access token in the session data
      // !IMPORTANT Don't do this in production, it's not secure
      notSecure: {
        notSecureAccessToken: `fake-not-secure-access-token`,
      },
    });
    return sendRedirect(event, '/');
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error);
    return sendRedirect(event, '/');
  },
});
