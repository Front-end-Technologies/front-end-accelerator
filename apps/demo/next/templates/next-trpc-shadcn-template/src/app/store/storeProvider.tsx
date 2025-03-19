"use client";

import { useEffect } from "react";

import { useThemeStore } from "./store";

export function StoreProvider(props: { children: React.ReactNode }) {
  const themeStore = useThemeStore();

  useEffect(() => {
    document.body.className = themeStore.theme;
  }, [themeStore.theme]);

  return <>{props.children}</>;
}
