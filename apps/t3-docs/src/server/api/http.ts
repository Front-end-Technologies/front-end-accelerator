import { auth } from "@/auth";
import { GitHubSession } from "@/interfaces";
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
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
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default http;
