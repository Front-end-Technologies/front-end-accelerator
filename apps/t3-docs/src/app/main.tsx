"use client";

import { FoldersSelect } from "@/components/folders-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, ExternalLink, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";

import { useThemeStore } from "./store";

export function Main({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const { open } = useSidebar();
  const { framework, name, type } = useParams();
  const { data: session } = useSession();

  useLayoutEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <main
      className={cn("flex flex-col space-y-4 p-4", {
        "w-[calc(100vw-224px)]": open,
        "w-full": !open,
      })}
    >
      <div className="flex items-center justify-between">
        <div className="flex grow items-center space-x-4">
          <SidebarTrigger className="h-8 w-8" variant="outline" />
          {framework && (
            <div className="flex items-center space-x-4">
              <ChevronRight /> <FoldersSelect />
            </div>
          )}
          {framework && name && (
            <div className="flex items-center space-x-4">
              <ChevronRight className="w-5" />
              <span>{name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {framework && name && (
            <>
              <Button
                onClick={() => {
                  window.open(
                    `https://github.com/Front-end-Technologies/front-end-accelerator-monorepo/tree/main/apps/demo/${framework}/${type}/${name}`,
                    "_blank",
                  );
                }}
                variant="outline"
              >
                <ExternalLink />
                Open in GitHub
              </Button>
            </>
          )}

          <p>{session?.user?.name}</p>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  alt={session?.user?.name || "User"}
                  src={session?.user?.image || "/logo.svg"}
                />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 w-72">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className="flex space-x-2"
                  onClick={() => signOut()}
                  type="submit"
                  variant="ghost"
                >
                  <LogOut />
                  Sign out
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {children}
    </main>
  );
}
