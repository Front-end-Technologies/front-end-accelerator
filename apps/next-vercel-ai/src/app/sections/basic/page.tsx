"use client";

import { ChatBasic } from "@/components/chats/chat-basic";
import ChatRoot from "@/components/chats/chat-root";
import BasicDocs from "@/docs/basic-docs.mdx";

export default function BasicSectionPage() {
  const title = "Basic";
  const description = "Explanation of basic functionality within Vercel AI-sdk";

   return (
    <ChatRoot drawerTitle={title} drawerDescription={description} MarkdownContent={BasicDocs}>
      <ChatBasic />
    </ChatRoot>
   )
}