import React from "react";

import { api, HydrateClient } from "~/trpc/server";

import PostsTable from "./posts-table";

export default async function Posts() {
  await api.postRouter.posts.prefetch({
    order: "asc",
    page: 1,
    q: "",
    sortBy: "id",
  });

  return (
    <HydrateClient>
      <PostsTable />
    </HydrateClient>
  );
}
