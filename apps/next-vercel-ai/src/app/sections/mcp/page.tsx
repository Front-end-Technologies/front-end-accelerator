"use client";

import { ChatMcp } from "@/components/chats/chat-mcp";
import ChatRoot from "@/components/chats/chat-root";
import ModelContextProviderDocs from "@/docs/model-context-provider-docs.mdx";

export default function ModelContextProtocolSectionPage() {
  const title = "Model Context Protocol";
  const description = "Explanation of model context protocol functionality within Vercel AI-sdk";

   return (
    <ChatRoot drawerTitle={title} drawerDescription={description} MarkdownContent={ModelContextProviderDocs}>
      <ChatMcp />
    </ChatRoot>
   )
}