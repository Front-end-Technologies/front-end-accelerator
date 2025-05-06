"use client";

import {
  Bot,
  Code,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  Braces,
  ImageIcon,
  Database,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

const cardData = [
  {
    href: "/sections/basic",
    icon: <Code className="h-5 w-5 text-purple-400" />,
    title: "SDK Fundamentals",
    description: "Learn basic implementation patterns",
    enabled: true,
  },
  {
    href: "/sections/tool-calling",
    icon: <Zap className="h-5 w-5 text-blue-400" />,
    title: "Tool Calling",
    description: "AI models invoking functions in your code",
    enabled: true,
  },
  {
    href: "/sections/human-in-the-loop",
    icon: <Users className="h-5 w-5 text-green-400" />,
    title: "User Interaction",
    description: "Build engaging AI chat interfaces",
    enabled: true,
  },
  {
    href: "/sections/structured-outputs",
    icon: <Sparkles className="h-5 w-5 text-pink-400" />,
    title: "Structured Outputs",
    description: "Generate structured data from text",
    enabled: true,
  },
  {
    href: "/sections/mcp",
    icon: <BookOpen className="h-5 w-5 text-yellow-400" />,
    title: "Model Context Protocol",
    description: "Manage context for better responses",
    enabled: true,
  },
  {
    href: "/sections/database-integrations",
    icon: <Database className="h-5 w-5 text-cyan-400" />,
    title: "Database Integrations",
    description: "Connect AI with persistent storage",
    enabled: false,
  },
  {
    href: "/sections/images-and-files",
    icon: <ImageIcon className="h-5 w-5 text-red-400" />,
    title: "Images and Files",
    description: "Process and generate visual content",
    enabled: false,
  },
  {
    href: "/sections/embeddings",
    icon: <Braces className="h-5 w-5 text-violet-400" />,
    title: "Embeddings",
    description: "Create vector representations of text",
    enabled: false,
  },
];

export default function ChatEmpty() {
  const { open } = useSidebar();

  return (
    <div className="flex flex-col items-center justify-center h-full xl:p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur-sm animate-pulse" />
        <div className="relative bg-black p-4 rounded-full">
          <Bot className="h-12 w-12 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">
        Explore Vercel AI SDK with Next.js
      </h2>
      <p className="text-gray-400 mb-6 max-w-md">
        Discover how to integrate AI capabilities into your Next.js applications
        through interactive examples and code snippets.
      </p>

      <h3 className="text-lg md:text-xl mb-2 text-white">Get started here</h3>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 w-full max-w-4xl",
          open ? "grid-cols-2" : "xl:grid-cols-3"
        )}
      >
        {cardData.filter(c => c.enabled).map((card, index) => (
          <Link key={`${card.title}-${index}`} href={card.href}>
            <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
              <div
                className={cn(
                  "flex items-start space-x-3",
                  open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""
                )}
              >
                <div
                  className={cn(
                    open
                      ? "flex justify-between items-center w-full xl:w-max"
                      : ""
                  )}
                >
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    {card.icon}
                  </div>
                  <ArrowRight
                    className={cn(
                      "h-5 w-5 text-gray-500 group-hover:text-white transition-colors",
                      open ? "xl:hidden" : "hidden"
                    )}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-400">{card.description}</p>
                </div>
                <ArrowRight
                  className={cn(
                    "h-5 w-5 text-gray-500 group-hover:text-white transition-colors",
                    open ? "hidden xl:block" : ""
                  )}
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Powered by Frontend Accelerator
      </div>
    </div>
  );
}
