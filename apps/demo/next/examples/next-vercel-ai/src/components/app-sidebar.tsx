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
  useSidebar,
} from "@/components/ui/sidebar";
import { Brain, CircleDot, Database, FileImage, FileJson, FunctionSquare, ScatterChart, UserRound } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col space-y-8 py-2">
            {open ? (
              <div className="flex items-center space-x-2">
                <Link className="flex items-center space-x-2" href="/">
                  <p className="font-bold">Next Vercel AI</p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  className="flex items-center space-x-2 text-center"
                  href="/"
                >
                  <p className="font-bold">Next AI</p>
                </Link>
              </div>
            )}

            {open && (
              <p className="flex flex-col space-y-4 text-xs leading-5">
                Speed up your Front-end development with pre-made building
                blocks in React, Next, Angular, Vue, Nuxt, Svelte, SvelteKit,...
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold uppercase">
            Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Basic */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Fundamental AI Concepts">
                  <div>
                    <CircleDot />
                    <Link href="/sections/basic">Basic</Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Model Context Protocol */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Nextjs Vercel AI Advanced">
                  <div>
                    <Brain />
                    <Link href="/sections/next-ai-mcp">
                      Model Context Protocol
                    </Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Tool calling */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Function Calling with AI">
                  <div>
                    <FunctionSquare />
                    <Link href="/sections/tool-calling">Tool calling</Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Structured outputs */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Formatted Data Responses">
                  <div>
                    <FileJson />
                    <Link href="/sections/structured-outputs">
                      Structured outputs
                    </Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Images and files */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Media Processing with AI">
                  <div>
                    <FileImage />
                    <Link href="/sections/images-files">Images and files</Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Database integrations */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Connect AI to Data Sources">
                  <div>
                    <Database />
                    <Link href="/sections/database-integrations">
                      Database integrations
                    </Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* User interaction */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Human-AI Interaction Patterns"
                >
                  <div>
                    <UserRound />
                    <Link href="/sections/user-interaction">
                      User interaction
                    </Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Embeddings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Vector Embeddings and Semantic Search"
                >
                  <div>
                    <ScatterChart />
                    <Link href="/sections/embeddings">Embeddings</Link>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
