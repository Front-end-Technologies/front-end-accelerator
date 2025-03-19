import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { getPosts } from "../services/post";

export const postRouter = createTRPCRouter({
  posts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        order: z.string(),
        page: z.number(),
        q: z.string(),
        sortBy: z.string(),
      }),
    )
    .query(async ({ input: { limit, page, ...input } }) => {
      const params = {
        ...input,
        limit,
        skip: (page - 1) * limit,
      };

      const {
        data: { posts, ...pagination },
      } = await getPosts(params);

      return {
        hasMore: posts.length === limit,
        posts,
        totalPages: Math.ceil(pagination.total / limit),
      };
    }),
});
