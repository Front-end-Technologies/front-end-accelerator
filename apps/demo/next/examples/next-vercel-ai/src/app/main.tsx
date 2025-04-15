"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Main({ children }: { children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <main
      className={cn("flex flex-col space-y-4 gradient-sidebar-lr", {
        "w-[calc(100vw-224px)]": open,
        "w-full": !open,
      })}
    >
      <div className="bg-black my-4 mr-4 p-8 rounded-2xl h-[calc(100svh-2rem)] ">
        {children}
      </div>
    </main>
  );
}
