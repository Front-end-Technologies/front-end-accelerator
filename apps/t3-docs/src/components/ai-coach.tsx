import { useThemeStore } from "@/app/store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AiCoach() {
  const ai = useThemeStore((state) => state.ai);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage alt="ai-coach" src="/ai-coach.webp" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">
          {ai.slang} {ai.role}
        </span>
        <span className="text-xs">
          {ai.llm.provider} {ai.llm.name}
        </span>
      </div>
    </div>
  );
}
