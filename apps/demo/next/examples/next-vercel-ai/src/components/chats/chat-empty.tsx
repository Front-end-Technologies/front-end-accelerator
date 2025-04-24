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
        className={`grid grid-cols-1 md:grid-cols-2  gap-3 mb-8 w-full max-w-4xl ${open ? "grid-cols-2" : "xl:grid-cols-3"}`}
      >
        {/* Card 1: SDK Fundamentals */}
        <Link href="/sections/basic">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-purple-900/30 p-2 rounded-lg">
                  <Code className="h-5 w-5 text-purple-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  SDK Fundamentals
                </h3>
                <p className="text-sm text-gray-400">
                  Learn basic implementation patterns
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 2: Tool Calling */}
        <Link href="/sections/tool-calling">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-blue-900/30 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">Tool Calling</h3>
                <p className="text-sm text-gray-400">
                  AI models invoking functions in your code
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 3: User Interaction */}
        <Link href="/sections/user-interaction">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-green-900/30 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  User Interaction
                </h3>
                <p className="text-sm text-gray-400">
                  Build engaging AI chat interfaces
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 4: Structured Outputs */}
        <Link href="/sections/structured-outputs">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-pink-900/30 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-pink-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  Structured Outputs
                </h3>
                <p className="text-sm text-gray-400">
                  Generate structured data from text
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 5: Model Context Protocol */}
        <Link href="/sections/mcp">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-yellow-900/30 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-yellow-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  Model Context Protocol
                </h3>
                <p className="text-sm text-gray-400">
                  Manage context for better responses
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 6: Database Integrations */}
        <Link href="/sections/database-integrations">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-cyan-900/30 p-2 rounded-lg">
                  <Database className="h-5 w-5 text-cyan-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  Database Integrations
                </h3>
                <p className="text-sm text-gray-400">
                  Connect AI with persistent storage
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 7: Images and Files */}
        <Link href="/sections/images-and-files">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-red-900/30 p-2 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-red-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">
                  Images and Files
                </h3>
                <p className="text-sm text-gray-400">
                  Process and generate visual content
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>

        {/* Card 8: Embeddings */}
        <Link href="/sections/embeddings">
          <Card className="h-full p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
            <div
              className={`flex items-start space-x-3 ${open ? "flex-col gap-2 xl:flex-row xl:gap-0" : ""}`}
            >
              <div
                className={`${open ? "flex justify-between items-center w-full xl:w-max" : ""}`}
              >
                <div className="bg-violet-900/30 p-2 rounded-lg">
                  <Braces className="h-5 w-5 text-violet-400" />
                </div>
                <ArrowRight
                  className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "xl:hidden" : "hidden"}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white mb-1">Embeddings</h3>
                <p className="text-sm text-gray-400">
                  Create vector representations of text
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 text-gray-500 group-hover:text-white transition-colors ${open ? "hidden xl:block" : ""}`}
              />
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Powered by Frontend Accelerator
      </div>
    </div>
  );
}
