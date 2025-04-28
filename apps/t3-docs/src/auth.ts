import axios from "axios";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ account, token }) {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      }

      if (Date.now() < Number(token.expires_at) * 1000) {
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
            refresh_token: token.refresh_token,
          },
        );

        const tokenUrlParams = new URLSearchParams(response.data);

        const newTokens = {
          ...token,
          access_token: tokenUrlParams.get("access_token"),
          expires_at:
            Math.floor(Date.now() / 1000) +
            Number(tokenUrlParams.get("expires_in")),
          refresh_token: tokenUrlParams.get("refresh_token"),
        };

        return newTokens;
      } catch (error) {
        console.error("Error refreshing access token", error);

        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },

    async session({ session, token }) {
      return {
        ...session,
        token: {
          access_token: token.access_token,
        },
      };
    },
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
});
