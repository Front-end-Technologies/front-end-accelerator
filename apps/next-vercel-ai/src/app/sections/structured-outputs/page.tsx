"use client";

import ChatRoot from "@/components/chats/chat-root";
import { ChatStructuredOutputs } from "@/components/chats/chat-structured-outputs";
import StructuredOuputsDocs from "@/docs/structured-output-docs.mdx";

export default function ModelContextProtocolSectionPage() {
  const title = "Structured Outputs";
  const description = "Explanation of structured outputs functionality within Vercel AI-sdk";

   return (
    <ChatRoot drawerTitle={title} drawerDescription={description} MarkdownContent={StructuredOuputsDocs}>
      <ChatStructuredOutputs />
    </ChatRoot>
   )
}