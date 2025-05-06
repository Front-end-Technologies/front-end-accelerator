"use client";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import {
  Send,
  CircleStop,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatEmpty from "./chat-empty";

import { ChatQuickActions } from "./chat-quick-action";
import { QuickAction } from "@/lib/types/quick-action";

const quickActions: QuickAction[] = [
  {
    section: "basic",
    label: "Get to know Jack Sparrow",
    value: "Tell me something about Jack Sparrow",
  },
];

export function ChatBasic() {
  const {
    error,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    status,
    reload,
    stop,
  } = useChat({ api: "/api/chat/basic" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <Card className="flex-1 overflow-y-auto flex flex-col mb-4">
        <div className={`flex-1 p-4 ${messages.length > 0 ? "space-y-4" : ""}`}>
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <ChatEmpty />
            </div>
          )}

          {messages.map((message, i) => (
            <div
              key={"message-" + i}
              className={`flex gap-2 md:gap-4 ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start md:max-w-[80%] flex-row-reverse"
              }`}
            >
              <div
                className={` rounded-lg px-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground md:max-w-[80%] py-2"
                    : "w-full"
                }`}
              >
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part, j) => {
                    return (
                      <div key={"message" + i + "-" + j}>
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  })}
              </div>
              <div
                className={`w-10 h-10 border ${
                  message.role === "user"
                    ? "rounded-md border-white"
                    : "bg-black border-purple-300 rounded-md"
                } flex items-center justify-center shadow-sm`}
              >
                {message.role === "user" ? (
                  <div className="text-white w-5 h-5 flex items-center justify-center">
                    BB
                  </div>
                ) : (
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={"/vercel.svg"} />
                    <AvatarFallback>BB</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex gap-4 justify-start max-w-[80%] flex-row-reverse">
              <div className="flex items-center rounded-lg px-4 w-full animate-pulse">
                Thinking...
              </div>
              <div className="w-10 h-10 border bg-black border-purple-300 rounded-md flex items-center justify-center shadow-sm">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={"/vercel.svg"} />
                  <AvatarFallback>BB</AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <div className="text-red-500">An error occurred.</div>
              <button
                type="button"
                className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
                onClick={() => reload()}
              >
                Retry
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <ChatQuickActions quickActions={quickActions} setInput={setInput} />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me to schedule a meeting..."
          className="flex-1 h-full"
        />

        {status === "submitted" || status === "streaming" ? (
          <Button onClick={stop} size={"lg"} className="bg-purple-300">
            <CircleStop className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size={"lg"}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </>
  );
}
