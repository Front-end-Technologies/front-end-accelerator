import axios from "axios";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ account, token }) {
      if (account) {
        // Initial sign in
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        // seconds
        token.expiresAt = account.expires_at;

        return token;
      }

      // expiresAt is in seconds
      // Date.now() is in milliseconds, so divide by 1000
      if (Math.floor(Date.now() / 1000) < Number(token.expiresAt)) {
        return token;
      }

      if (!token.refreshToken) {
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
          // expires_in = 28800 seconds (8hours)
          // expiresAt is in seconds, add 8 hours to current time
          // date.now() is in milliseconds, so divide by 1000
          expiresAt: Math.floor(Date.now() / 1000) + newTokens.expires_in,
          refreshToken: newTokens.refresh_token || token.refreshToken,
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
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
});
