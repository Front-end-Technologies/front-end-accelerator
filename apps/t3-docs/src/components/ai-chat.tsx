import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { AlertCircleIcon, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function AIChat() {
  const { data: session } = useSession();

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // make endpoint for helpful assistant that explains code and concepts in the chatwindow

  // make endpoint for pure code generation

  // make endpoint for explaining code and concepts

  const { error, handleInputChange, handleSubmit, input, messages } = useChat({
    api: `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
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
    <div className="bg-sidebar flex h-full flex-col space-y-4 rounded-xl border p-4">
      <div
        className="flex h-full flex-col space-y-4 overflow-y-auto"
        ref={messagesRef}
      >
        <div className="bg-code sticky top-0 flex items-center py-2">
          <div className="flex grow items-center space-x-4">
            <div>AI</div>
            <div>
              <p className="text-xs font-semibold">AI-Chatbot</p>
              <p className="text-xs">Demo AI chatbot gpt-4-mini</p>
            </div>
          </div>
        </div>

        {messages.map(
          ({
            content,
            id,
            role,
            // toolInvocations
          }) => (
            <div className="flex flex-col space-y-2" key={id}>
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
                  {/* {toolInvocations && (
                      <pre>{JSON.stringify(toolInvocations, null, 2)}</pre>
                    )} */}
                  <Markdown>{content}</Markdown>
                </div>
              </div>
              {isAi(role) && (
                <div className="flex items-center justify-end"></div>
              )}
            </div>
          ),
        )}
      </div>

      {error && (
        <p className="flex items-center space-x-4 font-semibold text-red-500">
          <AlertCircleIcon />
          <span>{error.message}</span>
        </p>
      )}

      <form className="flex items-center space-x-4" onSubmit={handleSubmit}>
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
