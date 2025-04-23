import { llm } from "@/lib/const";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  ai: {
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
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ai: {
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
