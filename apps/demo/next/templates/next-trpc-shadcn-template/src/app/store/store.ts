import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

// a theme store that persists the theme in localStorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
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

interface AppState {
  count: number;
  decrement: () => void;
  increment: () => void;
}
// an app store that does not persist the state but act as a global store
export const useAppStore = create<AppState>((set) => ({
  count: 0,
  decrement: () => set((state) => ({ count: state.count - 1 })),
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
