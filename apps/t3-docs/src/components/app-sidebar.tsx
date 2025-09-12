"use client";

import { Boxes, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
import { Framework } from "@/lib/const";
import { api } from "@/trpc/react";

import { FoldersSelect } from "./folders-select";
import { ThemeDropdown } from "./theme-dropdown";

export const FrameworkLogo = ({ framework }: { framework: Framework }) => {
  const logos = {
    angular: "/angular-logo.svg",
    next: "/next-logo.svg",
    nuxt: "/nuxt-logo.svg",
    react: "/react-logo.svg",
  };

  return (
    <picture>
      <img
        alt={`${framework} logo`}
        className="h-6 w-6"
        src={logos[framework as keyof typeof logos]}
      />
    </picture>
  );
};

export function AppSidebar() {
  const { framework } = useParams<{ framework: Framework }>();

  const [folders] = api.gitHub.getFolders.useSuspenseQuery();

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
              Speed up your Front-end development with our AI-infused cookbooks
              and examples. Explore the latest trends and best practices to
              enhance your skills and stay up-to-date with the ever-evolving
              world of front-end development.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold uppercase">
            Architecture
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link className="flex items-center gap-3" href="/architect/spa">
                  <Boxes />
                  Single Page App
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link className="flex items-center gap-3" href="/architect/mpa">
                  <Boxes />
                  Multi Page App
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link className="flex items-center gap-3" href="/architect/mfe">
                  <Boxes />
                  Micro Front-Ends
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  className="flex items-center gap-3"
                  href="/architect/recommended"
                >
                  <Boxes />
                  Recommended Hybrid
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold uppercase">
            Framework
          </SidebarGroupLabel>
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
