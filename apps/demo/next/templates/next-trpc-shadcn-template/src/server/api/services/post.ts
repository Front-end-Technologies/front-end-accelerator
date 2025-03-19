import { PostResponse } from "~/interfaces/post.interface";

import { createRestClient } from "../rest";

const restCLient = createRestClient({ baseURL: "https://dummyjson.com" });

export const getPosts = (params: {
  limit: number;
  order: string;
  q: string;
  skip: number;
  sortBy: string;
}) => restCLient.get<PostResponse>(`/posts/search`, { params });
