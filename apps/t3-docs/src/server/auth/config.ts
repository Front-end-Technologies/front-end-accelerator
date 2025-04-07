import axios from "axios";
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
        token.expiresAt = account.expires_at;
        return token;
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      if (!token.refresh_token) {
        throw new TypeError("Missing refresh_token");
      }

      // Access token has expired, refresh it
      try {
        const response = await axios.post(
          "https://github.com/login/oauth/access_token",
          {
            client_id: process.env.AUTH_GITHUB_ID,
            client_secret: process.env.AUTH_GITHUB_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          },
        );

        const newTokens = response.data;

        if (!newTokens) throw newTokens;

        return {
          ...token,
          accessToken: newTokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
          refreshToken: newTokens.refresh_token ?? token.refreshToken,
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
