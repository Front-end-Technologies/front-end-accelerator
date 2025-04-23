import { useThemeStore } from "@/app/store";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { AlertCircleIcon, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { MarkdownContent } from "./markdown-content";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AIChat() {
  const { data: session } = useSession();

  const llm = useThemeStore((state) => state.ai.llm);
  const role = useThemeStore((state) => state.ai.role);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { error, handleInputChange, handleSubmit, input, messages } = useChat({
    api: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/chat`,
    body: { llm },
    initialMessages: [
      {
        content: "Hello, how can I help you?",
        id: "1",
        role: "assistant",
      },
    ],
  });

  const isUser = (role: string) => role === "user";
  const isAi = (role: string) => role !== "user";

  useEffect(() => {
    const currentRef = messagesRef.current;
    if (!currentRef) return;

    currentRef.scrollTop = currentRef.scrollHeight;
  }, [messages]);

  return (
    <div className="bg-sidebar flex h-full flex-col space-y-4 rounded-xl border">
      <div
        className="scrollbar-hide flex h-full flex-col space-y-4 overflow-y-auto"
        ref={messagesRef}
      >
        <div className="bg-code sticky top-0 z-50 flex items-center rounded-t-xl p-4">
          <div className="flex grow items-center space-x-4">
            <Avatar>
              <AvatarImage src="/openai-logo.svg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold">{role}</p>
              <p className="text-xs">
                {llm.provider} {llm.name}
              </p>
            </div>
          </div>
        </div>

        {messages.map(({ content, id, role }) => (
          <div className="flex flex-col space-y-2 p-4" key={id}>
            <div
              className={clsx("flex items-center gap-4", {
                "flex-row": isAi(role),
                "flex-row-reverse": isUser(role),
              })}
            >
              {isUser(role) && session?.user?.image ? (
                <Avatar>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>{session.user.name}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage src="/openai-logo.svg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={clsx(
                  "border-border space-y-4 rounded-xl border p-3",
                  {
                    "bg-emerald-100 dark:bg-emerald-900": isUser(role),
                    "bg-sky-100 dark:bg-sky-900": isAi(role),
                  },
                )}
              >
                <MarkdownContent>{content}</MarkdownContent>
              </div>
            </div>
            {isAi(role) && (
              <div className="flex items-center justify-end"></div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="flex items-center space-x-4 font-semibold text-red-500">
          <AlertCircleIcon />
          <span>{error.message}</span>
        </p>
      )}

      <form className="flex items-center space-x-4 p-4" onSubmit={handleSubmit}>
        <Input
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          placeholder="Say something..."
          value={input}
        />
        <Button onClick={handleSubmit} type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
}
