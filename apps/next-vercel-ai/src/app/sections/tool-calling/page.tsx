"use client";

import ChatRoot from "@/components/chats/chat-root";
import { ChatTools } from "@/components/chats/chat-tools";
import ToolCallingDocs from "@/docs/tool-calling-docs.mdx";

export default function ModelContextProtocolSectionPage() {
  const title = "Tool Calling";
  const description = "Explanation of tool calling functionality within Vercel AI-sdk";

   return (
    <ChatRoot drawerTitle={title} drawerDescription={description} MarkdownContent={ToolCallingDocs}>
      <ChatTools />
    </ChatRoot>
   )
}