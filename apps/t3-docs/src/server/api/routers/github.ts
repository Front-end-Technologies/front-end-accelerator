import { GitHubContent, GithubMember, GithubUser } from "@/interfaces";
import { createHttp } from "@/lib/api";
import { Type } from "@/lib/const";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import {
  fetchFolderFiles,
mapGithubToWebcontainerFileSystem,
} from "../webcontainer";

const http = createHttp();

export const gitHubRouter = createTRPCRouter({
  getFolders: protectedProcedure.query(async () => {
    const files: GitHubContent[] = await http.get(
      `/repos/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/apps/demo`,
    );
    return files;
  }),
  getMembers: protectedProcedure.query(async () => {
    const members: GithubMember[] = await http.get(
      `/orgs/Front-end-Technologies/members`,
    );

    const users = await Promise.all(
      members.map(async (member) => {
        const user: GithubUser = await http.get(`/users/${member.login}`);
        return {
          ...member,
          user,
        };
      }),
    );

    return users;
  }),
  getProject: protectedProcedure
    .input(
      z.object({ framework: z.string(), name: z.string(), type: z.string() }),
    )
    .query(async ({ input }) => {
      const repoContent = await fetchFolderFiles(
        `/repos/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/apps/demo/${input.framework}/${input.type}/${input.name}`,
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
        `/repos/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/apps/demo/${input.framework}/${Type.COOKBOOK}`,
      );
      const exampleResponse: Promise<GitHubContent[]> = http.get(
        `/repos/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/apps/demo/${input.framework}/${Type.EXAMPLES}`,
      );

      const [cookbook, examples] = await Promise.all([
        cookbookResponse,
        exampleResponse,
      ]);

      return [
        { data: cookbook, type: Type.COOKBOOK },
        { data: examples, type: Type.EXAMPLES },
      ];
    }),
});
