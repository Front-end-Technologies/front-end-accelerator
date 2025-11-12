"use client";

import { AIChat } from "@/components/ai-chat";
import { useSidebar } from "@/components/ui/sidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useThemeStore } from "./store";

export default function Main({ children }: { children: React.ReactNode }) {
  const ai = useThemeStore((state) => state.ai);
  const { open } = useSidebar();

  // When the AI chat panel is open we want the main panel and chat panel
  // to sum to 100%. Compute sensible defaults so we don't trigger the
  // "Invalid layout total size" warning from react-resizable-panels.
  const chatOpen = !!ai.chat.open;
  const chatSize = chatOpen ? 25 : 0; // percent
  const mainSize = chatOpen ? 100 - chatSize : 100; // percent

  return (
    <PanelGroup
      className="gap-2 px-4"
      direction="horizontal"
      style={{ width: open ? `calc(100vw - 16rem)` : `100vw` }}
    >
      <Panel id="main-panel" order={0} defaultSize={mainSize}>
        {children}
      </Panel>

      {chatOpen && (
        <>
          <PanelResizeHandle />
          <Panel
            id="ai-chat-panel"
            order={1}
            defaultSize={chatSize}
            maxSize={50}
            minSize={20}
          >
            <AIChat key={ai.mcp.name} />
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}
