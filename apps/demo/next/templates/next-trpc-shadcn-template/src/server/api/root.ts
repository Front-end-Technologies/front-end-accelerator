import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { postRouter } from "./routers/post";

export const appRouter = createTRPCRouter({
  postRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
