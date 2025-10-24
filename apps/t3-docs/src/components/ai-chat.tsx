import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import clsx from "clsx";
import { AlertCircleIcon, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { AiCoach } from "./ai-coach";
import { MarkdownContent } from "./markdown-content";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AIChat() {
  const [input, setInput] = useState("");
  const { data: session } = useSession();

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { error, messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai/api/chat",
    }),
  });

  console.log("messages: ", messages);
  // const { error, messages, sendMessage } = useChat({
  //   messages: [
  //     {
  //       id: "1",
  //       parts: [
  //         {
  //           text: "Hello, how can I help you?",
  //           type: "reasoning",
  //         },
  //       ],
  //       role: "assistant",
  //     },
  //   ],
  //   transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  // });

  // const isUser = (role: string) => role === "user";
  // const isAi = (role: string) => role !== "user";

  // useEffect(() => {
  //   const currentRef = messagesRef.current;
  //   if (!currentRef) return;

  //   currentRef.scrollTop = currentRef.scrollHeight;
  // }, [messages]);

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   sendMessage({ text: input });
  //   setInput("");
  // };

  return (
    <div
      className="bg-sidebar flex h-full flex-col space-y-4 overflow-y-auto rounded-xl border"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div
        className="scrollbar-hide flex h-full flex-col space-y-4 overflow-y-auto"
        ref={messagesRef}
      >
        <div className="bg-code sticky top-0 z-50 flex items-center rounded-t-xl p-4">
          <AiCoach />
        </div>
        messages come here
        {/* {messages.map(({ id, parts, role }) => (
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
                <MarkdownContent>
                  {parts.map((part) => part.text).join("\n")}
                </MarkdownContent>
              </div>
            </div>
            {isAi(role) && (
              <div className="flex items-center justify-end"></div>
            )}
          </div>
        ))} */}
      </div>

      {/* {error && (
        <p className="flex items-center space-x-4 font-semibold text-red-500">
          <AlertCircleIcon />
          <span>{error.message}</span>
        </p>
      )} */}

      {/* <form className="flex items-center space-x-4 p-4" onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          placeholder="Say something..."
          value={input}
        />
        <Button onClick={handleSubmit} type="submit">
          <Send />
        </Button>
      </form> */}
      <form
        className="flex items-center space-x-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <Input
          disabled={status !== "ready"}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          value={input}
        />
        <Button disabled={status !== "ready"} type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
}
