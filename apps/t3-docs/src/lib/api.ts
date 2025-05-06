import { auth } from "@/auth";
import { GitHubSession } from "@/interfaces";
import { AtpAgent } from "@atproto/api";
import axios, { CreateAxiosDefaults } from "axios";

// axios instance
export const createHttp = (config?: CreateAxiosDefaults) => {
  const http = axios.create({
    baseURL: config?.baseURL || `${process.env.NEXT_PUBLIC_GITHUB_API_URL}`,
    timeout: 5000,
    ...config,
  });

  http.interceptors.request.use(
    async (config) => {
      const { token } = (await auth()) as GitHubSession;

      return {
        ...config,
        headers: new axios.AxiosHeaders({
          ...config.headers,
          Authorization: `Bearer ${token.access_token}`,
        }),
      };
    },
    (error) => Promise.reject(error),
  );

  http.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 401) {
          // Unauthorized, redirect to login
          console.error("Unauthorized, please log in again.");
        }
      }
      return Promise.reject(error);
    },
  );

  return http;
};

// bluesky agent
export const agent = new AtpAgent({
  // App View URL
  service: "https://api.bsky.app",
  // If you were making an authenticated client, you would
  // use the PDS URL here instead - the main one is bsky.social
  // service: "https://bsky.social",
});
