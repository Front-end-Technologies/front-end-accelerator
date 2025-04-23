"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { FoldersSelect } from "./folders-select";
import { ThemeDropdown } from "./theme-dropdown";

export const FrameworkLogo = ({ framework }: { framework: string }) => {
  const logos: Record<string, string> = {
    angular: "/angular-logo.svg",
    next: "/next-logo.svg",
    nuxt: "/nuxt-logo.svg",
    react: "/react-logo.svg",
  };

  if (!logos[framework]) return null;

  return (
    <picture>
      <img
        alt={`${framework} logo`}
        className="h-6 w-6"
        src={logos[framework]}
      />
    </picture>
  );
};

export function AppSidebar() {
  const { framework } = useParams<{ framework: string }>();

  const { data: folders } = api.gitHub.getFolders.useQuery();

  const {
    data: projects,
    isLoading,
    isSuccess,
  } = api.gitHub.getProjects.useQuery(
    { framework },
    { enabled: !!framework && !!folders },
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col space-y-8 py-2">
            <div className="flex items-center space-x-2">
              <Link className="flex items-center space-x-2" href="/">
                <picture>
                  <img
                    alt="Front-end Accelerator"
                    className="h-12"
                    src="/logo.svg"
                  />
                </picture>
                <p className="font-bold">Front-end Accelerator</p>
              </Link>

              <ThemeDropdown />
            </div>

            <p className="flex flex-col space-y-4 text-xs leading-5">
              Speed up your Front-end development with pre-made building blocks
              in React, Next, Angular, Vue, Nuxt, Svelte, SvelteKit,...
            </p>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Framework</SidebarGroupLabel>
          <SidebarGroupContent>
            <FoldersSelect />
          </SidebarGroupContent>
        </SidebarGroup>

        {isLoading && (
          <div className="flex items-center space-x-2 p-4">
            <LoaderCircle className="animate-spin" />
            <span className="grow text-xs">Fetching projects...</span>
          </div>
        )}

        {isSuccess &&
          projects.map(({ data, type }) => (
            <SidebarGroup key={type}>
              <SidebarGroupLabel className="font-bold uppercase">
                {type}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.map((project) => (
                    <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild>
                        <Link href={`/${framework}/${type}/${project.name}`}>
                          <span>{project.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
    </Sidebar>
  );
}
