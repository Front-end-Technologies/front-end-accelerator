"use client";

import { AvatarImage } from "@radix-ui/react-avatar";
import { Dialog } from "@radix-ui/react-dialog";

import { useThemeStore } from "@/app/store";

import { MarkdownContent } from "./markdown-content";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function AiResponseDialog({
  aiOutput,
  onOpenChange,
}: {
  aiOutput: string;
  onOpenChange: (open: boolean) => void;
}) {
  const llm = useThemeStore((state) => state.ai.llm);
  const role = useThemeStore((state) => state.ai.role);
  const slang = useThemeStore((state) => state.ai.slang);

  return (
    <Dialog onOpenChange={onOpenChange} open={!!aiOutput}>
      <DialogContent className="max-h-[90vh] min-w-1/2 overflow-auto bg-sky-100 leading-normal dark:bg-sky-900">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt="ai-coach" src="/ai-coach.webp" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span>AI-Coach: {role}</span>
          </DialogTitle>
          <DialogDescription>
            Explaining code with {llm.provider} {llm.name} in {slang} style
          </DialogDescription>
        </DialogHeader>

        <MarkdownContent>{aiOutput}</MarkdownContent>
      </DialogContent>
    </Dialog>
  );
}
