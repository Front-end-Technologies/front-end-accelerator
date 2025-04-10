"use client";

import { useThemeStore } from "@/app/store";
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
import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { FoldersSelect } from "./folders-select";
import { Button } from "./ui/button";

export const FrameworkLogo = ({ framework }: { framework: string }) => {
  const theme = useThemeStore((state) => state.theme);

  const logos: Record<string, string> = {
    angular: "/angular-logo.svg",
    next: theme === "light" ? "/next-logo.svg" : "/next-logo-dark.svg",
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
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const { data: folders } = api.gitHub.getFolders.useQuery();

  const cookbookQuery = api.gitHub.getProjects.useQuery(
    { framework, type: "cookbook" },
    { enabled: !!framework && !!folders },
  );

  const examplesQuery = api.gitHub.getProjects.useQuery(
    { framework, type: "examples" },
    { enabled: !!framework && !!folders },
  );

  const mapped = useMemo(
    () => [
      { data: cookbookQuery.data, type: "cookbook" },
      { data: examplesQuery.data, type: "examples" },
    ],
    [cookbookQuery.data, examplesQuery.data],
  );

  const isSuccess = cookbookQuery.isSuccess || examplesQuery.isSuccess;

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
              <Button className="w-9" onClick={toggleTheme} variant="ghost">
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
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

        {isSuccess &&
          mapped.flatMap(({ data, type }) => (
            <SidebarGroup key={type}>
              <SidebarGroupLabel className="font-bold uppercase">
                {type}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data?.map((project) => (
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
