import { auth } from "@/auth";
import { GitHubSession } from "@/interfaces";
import { githubURL } from "@/lib/const";
import axios, { CreateAxiosDefaults } from "axios";

export const createHttp = (config?: CreateAxiosDefaults) => {
  const http = axios.create({
    baseURL: config?.baseURL || githubURL,
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
          Authorization: `Bearer ${token.accessToken}`,
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
