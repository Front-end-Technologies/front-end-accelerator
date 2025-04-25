import { ChatBasic } from "@/components/chats/chat-basic";
import { ChatHitl } from "@/components/chats/chat-human-in-the-loop";
import { ChatMcp } from "@/components/chats/chat-mcp";
import { ChatStructuredOutputs } from "@/components/chats/chat-structured-outputs";
import { ChatTools } from "@/components/chats/chat-tools";
import { JSX } from "react";

const chatRenders: {
  section: string;
  render: JSX.Element;
}[] = [
  {
    section: 'basic',
    render: <ChatBasic />,
  },
  {
    section: 'tool-calling',
    render: <ChatTools />,
  },
  {
    section: 'human-in-the-loop',
    render: <ChatHitl />,
  },
  {
    section: 'structured-outputs',
    render: <ChatStructuredOutputs />,
  },
  {
    section: 'mcp',
    render: <ChatMcp />,
  }
]

export default async function SectionPage({
    params,
  }: {
    readonly params: Promise<{ section: string }>
  }) {
    const { section } = await params
    const chatRender = chatRenders.find((chatrender) => chatrender.section === section)?.render;
    if (!chatRender) {
      return <div>Section not found</div>;
    }
    return chatRender;
}