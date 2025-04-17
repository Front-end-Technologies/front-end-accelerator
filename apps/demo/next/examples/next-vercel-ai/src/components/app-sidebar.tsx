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
import {
  Bot,
  Brain,
  CircleDot,
  Database,
  FileImage,
  FileJson,
  FunctionSquare,
  ScatterChart,
  UserRound,
} from "lucide-react";
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
                  <Bot className="h-8 w-8 text-white" />
                  <p className="font-bold">Next Vercel AI</p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  className="flex items-center space-x-2 text-center"
                  href="/"
                >
                  <Bot className="h-8 w-8 text-white" />
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
                  <Link href="/sections/basic">
                    <div className="flex items-center gap-2">
                      <CircleDot className="w-4 h-4 shrink-0" />
                      <span>Basic</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Tool calling */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Function Calling with AI">
                  <Link href="/sections/tool-calling">
                    <div className="flex items-center gap-2">
                      <FunctionSquare className="w-4 h-4 shrink-0"/>
                      <span>Tool calling</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Human in the loop */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Human-AI Interaction Patterns"
                >
                  <Link href="/sections/human-in-the-loop">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-4 h-4 shrink-0"/>
                      <span>Human in the loop</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Structured outputs */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Formatted Data Responses">
                  <Link href="/sections/structured-outputs">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 shrink-0"/>
                      <span>Structured outputs</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Model Context Protocol */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Provide context to AI models"
                >
                  <Link href="/sections/mcp">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 shrink-0"/>
                      <span>Model Context Protocol</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Database integrations */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Connect AI to Data Sources">
                  <Link href="/sections/database-integrations">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 shrink-0"/>
                      <span>Database integrations</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Images and files */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Media Processing with AI">
                  <Link href="/sections/images-files">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-4 h-4 shrink-0"/>
                      <span>Images and files</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Embeddings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Vector Embeddings and Semantic Search"
                >
                  <Link href="/sections/embeddings">
                    <div className="flex items-center gap-2">
                      <ScatterChart className="w-4 h-4 shrink-0"/>
                      <span>Embeddings</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
