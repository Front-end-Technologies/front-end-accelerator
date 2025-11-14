import { create } from "zustand";
import { persist } from "zustand/middleware";

import { llm, mcps } from "@/lib/const";

export interface ThemeState {
  ai: {
    mcp: {
      name: string;
      provider: string;
      description: string;
      url: string;
      route: string;
    };
    chat: { open: boolean };
    framework: { output: string };
    llm: {
      description: string;
      name: string;
      provider: string;
    };
    role: string;
    slang: string;
  };
  setAiLLM: (llm: ThemeState["ai"]["llm"]) => void;
  setAiOutputFramework: (output: string) => void;
  setAiRole: (slang: string) => void;
  setAiSlang: (style: string) => void;
  toggleAIChat: () => void;
  setAiMcp: (mcp: ThemeState["ai"]["mcp"]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ai: {
        mcp: mcps[0]!,
        chat: {
          open: false,
        },
        framework: {
          output: "",
        },
        llm: llm[0]!,
        role: "Software Architect",
        slang: "Detailed",
      },
      setAiMcp: (mcp: ThemeState["ai"]["mcp"]) => {
        set((state) => ({
          ai: {
            ...state.ai,
            mcp,
          },
        }));
      },
      setAiLLM: (llm: ThemeState["ai"]["llm"]) => {
        set((state) => ({
          ai: {
            ...state.ai,
            llm: {
              ...state.ai.llm,
              ...llm,
            },
          },
        }));
      },
      setAiOutputFramework: (output: string) => {
        set((state) => ({
          ai: {
            ...state.ai,
            framework: {
              ...state.ai.framework,
              output,
            },
          },
        }));
      },
      setAiRole: (role: string) => {
        set((state) => ({
          ai: {
            ...state.ai,
            role,
          },
        }));
      },
      setAiSlang: (slang: string) => {
        set((state) => ({
          ai: {
            ...state.ai,
            slang,
          },
        }));
      },
      toggleAIChat: () => {
        set((state) => ({
          ai: {
            ...state.ai,
            chat: {
              ...state.ai.chat,
              open: !state.ai.chat.open,
            },
          },
        }));
      },
    }),
    { name: "theme-storage" },
  ),
);
