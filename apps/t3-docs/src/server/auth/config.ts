import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authConfig = {
  callbacks: {
    async jwt({ account, token }) {
      if (account) {
        // Initial sign in
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Math.floor(
          Date.now() / 1000 + (account.expires_in as number),
        );
        return token;
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, refresh it
      try {
        const response = await fetch(
          "https://github.com/login/oauth/access_token",
          {
            body: JSON.stringify({
              client_id: process.env.AUTH_GITHUB_ID,
              client_secret: process.env.AUTH_GITHUB_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken,
            }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          },
        );

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
          refreshToken: tokens.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      return {
        ...session,
        token: {
          accessToken: token.accessToken,
          error: token.error,
        },
      };
    },
  },
  providers: [
    GitHub({
      authorization: {
        params: {
          response_type: "code",
          scope: "repo offline_access",
        },
      },
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
