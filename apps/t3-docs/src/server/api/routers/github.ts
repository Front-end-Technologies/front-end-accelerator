import { GitHubContent } from "@/interfaces";
import {
  fetchFolderFiles,
  mapGithubToWebcontainerFileSystem,
} from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import http from "../http";

const baseURL = `${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}`;

export const gitHubRouter = createTRPCRouter({
  getFolders: protectedProcedure.query(async () => {
    const files: GitHubContent[] = await http.get(
      `${baseURL}/contents/apps/demo`,
    );
    return files;
  }),
  getProject: protectedProcedure
    .input(
      z.object({ framework: z.string(), name: z.string(), type: z.string() }),
    )
    .query(async ({ input }) => {
      const repoContent = await fetchFolderFiles(
        `${baseURL}/contents/apps/demo/${input.framework}/${input.type}/${input.name}`,
      );
      const webcontainerFiles = mapGithubToWebcontainerFileSystem(repoContent);

      return {
        repoContent,
        webcontainerFiles,
      };
    }),

  getProjects: protectedProcedure
    .input(z.object({ framework: z.string(), type: z.string() }))
    .query(async ({ input }) => {
      const projects: GitHubContent[] = await http.get(
        `${baseURL}/contents/apps/demo/${input.framework}/${input.type}`,
      );

      return projects;
    }),
});
