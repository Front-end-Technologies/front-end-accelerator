"use client";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  createCalendarMeetingSuggestion,
  createDateRange,
  parseDate,
  tools,
} from "@/lib/tools";
import { APPROVAL, getToolsRequiringConfirmation } from "@/lib/utils";
import { Message, useChat } from "@ai-sdk/react";
import { Send, Flame, Zap, CircleStop } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarConfirmation } from "@/components/calendar-confirmation";
import { CalendarApproval } from "@/components/calendar-success";
import EmptyChat from "./empty-chat";

import UserInteractionDocs from "@/docs/user-interaction-docs.mdx";
import { ChatQuickActions } from "@/lib/interfaces";

const quickActions: ChatQuickActions[] = [
  {
    section: "user-interaction",
    label: "Schedule a team meeting",
    value: "Schedule a meeting with the team tomorrow at 9am for our standup",
  },
  {
    section: "user-interaction",
    label: "Schedule a long meeting",
    value:
      "Schedule a meeting with the team tomorrow at 2pm for 2 hours for an integration checkup",
  },
  {
    section: "user-interaction",
    label: "Schedule a meeting next week",
    value:
      "Schedule a meeting next friday at 2pm for 2 hours for a project review",
  },
];

export function ChatHitl() {
  const {
    error,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    setInput,
    status,
    reload,
    stop,
  } = useChat({ api: "/api/chat/human-in-the-loop" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toolsRequiringConfirmation = getToolsRequiringConfirmation(tools);

  const pendingToolCallConfirmation = messages.some((m: Message) =>
    m.parts?.some(
      (part) =>
        part.type === "tool-invocation" &&
        part.toolInvocation.state === "call" &&
        toolsRequiringConfirmation.includes(part.toolInvocation.toolName)
    )
  );
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
          <UserInteractionDocs />
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
                    {message.parts?.map((part, j) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={j}>
                              <Markdown>{part.text}</Markdown>
                            </div>
                          );
                        case "tool-invocation":
                          const toolInvocation = part.toolInvocation;
                          const toolCallId = toolInvocation.toolCallId;

                          if (
                            toolsRequiringConfirmation.includes(
                              part.toolInvocation.toolName
                            )
                          ) {
                            switch (toolInvocation.state) {
                              case "call":
                                if (
                                  toolInvocation.toolName ===
                                  "createCalendarMeetingSuggestion"
                                ) {
                                  const args =
                                    createCalendarMeetingSuggestion.parameters.parse(
                                      toolInvocation.args
                                    );
                                  return (
                                    <div
                                      key={toolCallId}
                                      className="mb-3 w-full"
                                    >
                                      <CalendarConfirmation
                                        key={toolCallId}
                                        title={args.title}
                                        startDate={args.startDate}
                                        endDate={args.endDate}
                                        attendees={args.attendees}
                                        description={args.description}
                                        location={args.location}
                                        toolCallId={toolCallId}
                                        onConfirm={addToolResult}
                                      />
                                    </div>
                                  );
                                }

                                return (
                                  <div className="flex items-center rounded-lg px-4 w-full animate-pulse">
                                    Thinking...
                                  </div>
                                );
                              case "result":
                                if (
                                  toolInvocation.toolName ===
                                  "createCalendarMeetingSuggestion"
                                ) {
                                  const args =
                                    createCalendarMeetingSuggestion.parameters.parse(
                                      toolInvocation.args
                                    );
                                  const approvalState =
                                    toolInvocation.result === APPROVAL.YES
                                      ? "success"
                                      : "denied";

                                  return (
                                    <div
                                      key={toolInvocation.toolCallId}
                                      className="mb-3 w-full"
                                    >
                                      <CalendarApproval
                                        title={args.title}
                                        startDate={args.startDate}
                                        endDate={args.endDate}
                                        attendees={args.attendees}
                                        state={approvalState}
                                      />
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex items-center rounded-lg px-4 w-full animate-pulse">
                                    Thinking...
                                  </div>
                                );
                            }
                          }

                          switch (toolInvocation.state) {
                            case "call":
                              if (toolInvocation.toolName === "parseDate") {
                                const args = parseDate.parameters.parse(
                                  toolInvocation.args
                                );
                                return (
                                  <div key={toolCallId} className="mb-3 w-full">
                                    <div className="text-sm text-muted-foreground">
                                      Parsing date: {args.dateReference}
                                    </div>
                                  </div>
                                );
                              }

                              if (
                                toolInvocation.toolName === "createDateRange"
                              ) {
                                const args = createDateRange.parameters.parse(
                                  toolInvocation.args
                                );

                                return (
                                  <div key={toolCallId} className="mb-3 w-full">
                                    <div className="text-sm text-muted-foreground">
                                      Creating date range: {args.dateReference}{" "}
                                      from {args.startTime} for {args.duration}{" "}
                                      minutes
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div className="flex items-center rounded-lg px-4 w-full animate-pulse">
                                  Thinking...
                                </div>
                              );
                            case "result":
                              if (toolInvocation.toolName === "parseDate") {
                                const args = parseDate.parameters.parse(
                                  toolInvocation.args
                                );
                                return (
                                  <div key={toolCallId} className="mb-3 w-full">
                                    <div className="text-sm text-muted-foreground">
                                      Parsed date: {args.dateReference} to{" "}
                                      {toolInvocation.result.formattedDate}
                                    </div>
                                  </div>
                                );
                              }

                              if (
                                toolInvocation.toolName === "createDateRange"
                              ) {
                                const args = createDateRange.parameters.parse(
                                  toolInvocation.args
                                );
                                return (
                                  <div key={toolCallId} className="mb-3 w-full">
                                    <div className="text-sm text-muted-foreground">
                                      Created date range: {args.dateReference}{" "}
                                      from {args.startTime} for {args.duration}{" "}
                                      minutes
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div className="flex items-center rounded-lg px-4 w-full animate-pulse">
                                  Thinking...
                                </div>
                              );
                          }

                          break;
                      }

                      return null;
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

              {status === "submitted" && messages.length <= 1 && (
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
              disabled={pendingToolCallConfirmation}
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
