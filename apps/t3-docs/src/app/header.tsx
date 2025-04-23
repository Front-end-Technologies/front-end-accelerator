"use client";

import { AiLLMSelect } from "@/components/ai-llm-select";
import { FoldersSelect } from "@/components/folders-select";
import { ProjectSelect } from "@/components/project-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { githubRepoURL } from "@/lib/const";
import {
  CircleX,
  ExternalLink,
  LogOut,
  Settings,
  SparklesIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import { useThemeStore } from "./store";

export function Header() {
  const toggleAIChat = useThemeStore((state) => state.toggleAIChat);
  const aiChatIsOpen = useThemeStore((state) => state.ai.chat.open);
  const { framework, name, type } = useParams();
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex grow items-center space-x-4">
        <SidebarTrigger className="h-8 w-8" variant="outline" />
        {framework && (
          <div className="flex items-center space-x-4">
            <span>/</span>
            <FoldersSelect />
            <span>/</span>
            <ProjectSelect />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {framework && name && (
          <>
            <Button
              onClick={() => {
                window.open(
                  `${githubRepoURL}/tree/main/apps/demo/${framework}/${type}/${name}`,
                  "_blank",
                );
              }}
              variant="outline"
            >
              <ExternalLink />
              Open in GitHub
            </Button>
            <Button
              aria-label={aiChatIsOpen ? "Close AI Chat" : "Open AI Chat"}
              onClick={toggleAIChat}
              variant="outline"
            >
              {aiChatIsOpen ? (
                <>
                  <CircleX />
                  <span>Close AI Chat</span>
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span>Open AI Chat</span>
                </>
              )}
            </Button>
          </>
        )}

        <AiLLMSelect />

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
          <DropdownMenuContent className="mr-4">
            <DropdownMenuItem>
              <Button
                className="flex space-x-2"
                onClick={() => signOut()}
                type="submit"
                variant="ghost"
              >
                <Settings />
                Settings
              </Button>
            </DropdownMenuItem>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
