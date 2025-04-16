import { GitHubContent } from "@/interfaces";
import {
  fetchFolderFiles,
  mapGithubToWebcontainerFileSystem,
} from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import { createHttp } from "../http";

const http = createHttp();

export const gitHubRouter = createTRPCRouter({
  getFolders: protectedProcedure.query(async () => {
    const files: GitHubContent[] = await http.get(`/contents/apps/demo`);
    return files;
  }),
  getProject: protectedProcedure
    .input(
      z.object({ framework: z.string(), name: z.string(), type: z.string() }),
    )
    .query(async ({ input }) => {
      const repoContent = await fetchFolderFiles(
        `/contents/apps/demo/${input.framework}/${input.type}/${input.name}`,
      );
      const webcontainerFiles = mapGithubToWebcontainerFileSystem(repoContent);

      return {
        repoContent,
        webcontainerFiles,
      };
    }),
  getProjects: protectedProcedure
    .input(z.object({ framework: z.string() }))
    .query(async ({ input }) => {
      const cookbookResponse: Promise<GitHubContent[]> = http.get(
        `/contents/apps/demo/${input.framework}/cookbook`,
      );
      const exampleResponse: Promise<GitHubContent[]> = http.get(
        `/contents/apps/demo/${input.framework}/examples`,
      );

      const [cookbook, examples] = await Promise.all([
        cookbookResponse,
        exampleResponse,
      ]);

      return [
        { data: cookbook, type: "cookbook" },
        { data: examples, type: "examples" },
      ];
    }),
});
