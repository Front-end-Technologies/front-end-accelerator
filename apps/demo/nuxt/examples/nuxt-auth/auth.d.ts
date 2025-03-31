// custom auth types ovverride default values
declare module '#auth-utils' {
  interface User {
    // Add your own fields
    roles: string[];
    githubId: string;
    login: string;
  }

  interface SessionData {
    // Add your own fields
    user: User;
    // Private data accessible only on server/routes
    secure: SecureSessionData;
    // not secure
    notSecure: {
      notSecureAccessToken: string;
    };
  }

  interface SecureSessionData {
    // Add your own fields
    accessToken: string;
    roles: string[];
  }
}

export {};
