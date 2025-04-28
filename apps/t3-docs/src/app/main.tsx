"use client";

import { AIChat } from "@/components/ai-chat";
import { useSidebar } from "@/components/ui/sidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useThemeStore } from "./store";

export default function Main({ children }: { children: React.ReactNode }) {
  const ai = useThemeStore((state) => state.ai);
  const { open } = useSidebar();

  return (
    <PanelGroup
      className="flex flex-col gap-2 px-4"
      direction="horizontal"
      style={{ width: open ? `calc(100vw - 16rem)` : `100vw` }}
    >
      <Panel>{children}</Panel>
      {ai.chat.open && (
        <>
          <PanelResizeHandle />
          <Panel defaultSize={25} maxSize={50} minSize={20}>
            <AIChat />
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}
