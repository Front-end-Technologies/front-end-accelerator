import axios, { type AxiosResponse } from "axios";

export const createRestClient = ({ baseURL }: { baseURL: string }) => {
  const restClient = axios.create({
    baseURL: baseURL,
    timeout: 5000,
  });

  restClient.interceptors.request.use((config) => config);

  restClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: Error) => {
      return Promise.reject(error);
    },
  );

  return restClient;
};
