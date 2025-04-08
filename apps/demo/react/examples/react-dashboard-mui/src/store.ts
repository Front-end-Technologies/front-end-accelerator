import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  toggleDashboard: () => void;
  ui: {
    dashboard: {
      open: boolean;
    };
  };
}

// a theme store that persists the theme in localStorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      toggleDashboard: () => {
        set((state) => {
          return { ui: { dashboard: { open: !state.ui.dashboard.open } } };
        });
      },
      ui: {
        dashboard: {
          open: true,
        },
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
