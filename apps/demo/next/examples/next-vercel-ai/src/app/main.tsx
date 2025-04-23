"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Main({ children }: { children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <main
      className={cn("flex flex-col space-y-4 gradient-sidebar-lr", {
        "w-full md:w-[calc(100vw-224px)]": open,
        "w-full": !open,
      })}
    >
      <div className="bg-black md:my-4 md:mr-4 p-4 md:p-8 md:rounded-2xl h-svh md:h-[calc(100svh-2rem)] ">
        {children}
      </div>
    </main>
  );
}
