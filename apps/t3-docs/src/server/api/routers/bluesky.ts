import { agent } from "@/lib/api";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

const blueSkyHandles = {
  angular: "angular.dev",
  next: "nextjs.org",
  nuxt: "nuxt.com",
  react: "react.dev",
  svelte: "svelte.dev",
  vue: "vuejs.org",
};

export const blueskyRouter = createTRPCRouter({
  getFeed: publicProcedure
    .input(
      z.object({
        framework: z.enum(
          Object.keys(blueSkyHandles) as [keyof typeof blueSkyHandles],
        ),
      }),
    )
    .query(async ({ input }) => {
      const feed = await agent.getAuthorFeed({
        actor: blueSkyHandles[input.framework],
        filter: "posts_and_author_threads",
      });

      return feed.data.feed;
    }),
});
