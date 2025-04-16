import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  ai: { chat: { open: boolean } };
  theme: "dark" | "light";
  toggleAIChat: () => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ai: {
        chat: {
          open: false,
        },
      },
      theme: "light",
      toggleAIChat: () => {
        set((state) => ({
          ai: {
            chat: {
              open: !state.ai.chat.open,
            },
          },
        }));
      },
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          return { theme: newTheme };
        });
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);
