"use client";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChat } from "@ai-sdk/react";
import { Send, Flame, Zap, CircleStop } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyChat from "./empty-chat";

import ToolCallingDocs from "@/docs/tool-calling-docs.mdx";
import { ChatQuickActions } from "@/lib/interfaces";

const quickActions: ChatQuickActions[] = [
  {
    section: "tool-calling",
    label: "Get the weather in Paris",
    value: "Get the weather in Paris",
  },
  {
    section: "tool-calling",
    label: "Get the weather at my current location",
    value: "Get the weather at my current location",
  },
  {
    section: "tool-calling",
    label: "Get the weather in ...",
    value: "Get the weather in <city>",
  },
  {
    section: "tool-calling",
    label: "Send mail a to ...",
    value:
      "Send a mail to <email> with subject <subject> and message <message>",
  },
];

export function ChatTools() {
  const {
    error,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    addToolResult,
    status,
    reload,
    stop,
  } = useChat({ api: "/api/chat/tools" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <SidebarTrigger className="h-8 w-8" variant="outline" />
        <h1 className="text-2xl font-bold">
          Frontend Accelerator Nextjs Vercel AI
        </h1>
      </div>
      <div className="flex gap-4 h-[calc(100%-2rem)] w-full">
        <div className="p-4 h-full w-1/3 overflow-y-scroll">
          <ToolCallingDocs />
        </div>

        <div className="flex flex-col p-4 w-full">
          <Card className="flex-1 overflow-y-auto flex flex-col mb-4">
            <div
              className={`flex-1 p-4 ${messages.length > 0 ? "space-y-4" : ""}`}
            >
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <EmptyChat />
                </div>
              )}

              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start max-w-[80%] flex-row-reverse"
                  }`}
                >
                  <div
                    className={` rounded-lg px-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground max-w-[80%] py-2"
                        : "w-full"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      switch (part.type) {
                        case "text":
                          return <Markdown key={index}>{part.text}</Markdown>;
                        case "tool-invocation": {
                          switch (part.toolInvocation.toolName) {
                            case "askForConfirmation": {
                              switch (part.toolInvocation.state) {
                                case "call":
                                  return (
                                    <div key={index} className="text-gray-500">
                                      {part.toolInvocation.args.message}
                                      <div className="flex gap-2 my-2">
                                        <Button
                                          className="bg-purple-300 hover:bg-purple-500 hover:cursor-pointer"
                                          onClick={() =>
                                            addToolResult({
                                              toolCallId:
                                                part.toolInvocation.toolCallId,
                                              result: "Yes, confirmed.",
                                            })
                                          }
                                        >
                                          Yes
                                        </Button>
                                        <Button
                                          className="hover:cursor-pointer"
                                          onClick={() =>
                                            addToolResult({
                                              toolCallId:
                                                part.toolInvocation.toolCallId,
                                              result: "No, denied",
                                            })
                                          }
                                        >
                                          No
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                case "result":
                                  return (
                                    <div
                                      key={index}
                                      className="text-gray-500 my-4"
                                    >
                                      Location access allowed
                                    </div>
                                  );
                              }
                              break;
                            }

                            case "getLocation": {
                              switch (part.toolInvocation.state) {
                                case "call":
                                  return (
                                    <div key={index} className="text-gray-500">
                                      Getting location...
                                    </div>
                                  );
                                case "result":
                                  return (
                                    <div
                                      key={index}
                                      className="text-gray-500 my-4"
                                    >
                                      Location: {part.toolInvocation.result}
                                    </div>
                                  );
                              }
                              break;
                            }
                          }
                        }
                      }
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

              {status === "submitted" && messages.length === 1 && (
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

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Flame className={"text-purple-300"} />
              <h4>Try one of these following questions to get started.</h4>
            </div>
            <div className="flex gap-4">
              {quickActions?.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => setInput(action.value)}
                  className="bg-purple-300 hover:bg-purple-500 hover:cursor-pointer"
                >
                  <Zap />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

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
        </div>
      </div>
    </>
  );
}
