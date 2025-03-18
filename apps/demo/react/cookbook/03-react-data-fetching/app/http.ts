import axios from 'axios';

import { baseUrl } from './const';

export const http = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

http.interceptors.request.use(
  async (config) => {
    // intercept and add the token to the headers

    return {
      ...config,
      headers: new axios.AxiosHeaders({
        ...config.headers,
        // Authorization: `Bearer ${accessToken}`,
      }),
    };
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default http;
