"use client";

import { ChatHitl } from "@/components/chats/chat-human-in-the-loop";
import ChatRoot from "@/components/chats/chat-root";
import UserInteractionDocs from "@/docs/user-interaction-docs.mdx";

export default function HumanInTheLoopSectionPage() {
  const title = "Human in the Loop";
  const description = "Explanation of human in the loop functionality within Vercel AI-sdk";

   return (
    <ChatRoot drawerTitle={title} drawerDescription={description} MarkdownContent={UserInteractionDocs}>
      <ChatHitl />
    </ChatRoot>
   )
}