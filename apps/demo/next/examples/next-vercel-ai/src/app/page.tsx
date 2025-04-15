"use client";

import { CalendarConfirmation } from "@/components/calendar-confirmation";
import { CalendarApproval } from "@/components/calendar-success";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createCalendarMeeting, tools } from "@/lib/tools";
import {
  APPROVAL,
  CALENDAR_APPROVAL,
  getToolsRequiringConfirmation,
} from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import TestMarkdown from "./testmarkdown.mdx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get tools that require confirmation
  const toolsRequiringConfirmation = getToolsRequiringConfirmation(tools);

  const submitUserMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const lastToolCall = messages[messages.length - 1]?.parts?.findLast(
      (part) => part.type === "tool-invocation"
    );
    if (
      lastToolCall &&
      toolsRequiringConfirmation.includes(
        lastToolCall.toolInvocation.toolName
      ) &&
      lastToolCall.toolInvocation.state === "call"
    ) {
      addToolResult({
        toolCallId: lastToolCall.toolInvocation.toolCallId,
        result: APPROVAL.NO,
      });
    }

    handleSubmit(event);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <SidebarTrigger className="h-8 w-8" variant="outline" />
        <h1 className="text-2xl font-bold">
          Frontend Accelerator Nextjs Vercel AI
        </h1>
      </div>
      <div className="flex gap-4 h-[calc(100%-2rem)] w-full">
        <div className="flex flex-col p-4 h-full w-1/3">
          <TestMarkdown />
        </div>
        <div className="flex flex-col p-4 w-full">
          <Card className="flex-1 overflow-hidden flex flex-col mb-4">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start max-w-[80%] flex-row-reverse"}`}
                >
                  <div
                    className={`flex items-center rounded-lg px-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground max-w-[80%] py-2"
                        : "w-full"
                    }`}
                  >
                    {message.parts?.map((part, j) => {
                      if (part.type === "text") {
                        return (
                          <div key={j}>
                            <Markdown>{part.text}</Markdown>
                          </div>
                        );
                      }

                      if (part.type === "tool-invocation") {
                        console.log(
                          "this part is a toolcall",
                          part.toolInvocation.toolName,
                          part.toolInvocation
                        );
                      }

                      if (
                        part.type === "tool-invocation" &&
                        toolsRequiringConfirmation.includes(
                          part.toolInvocation.toolName
                        )
                      ) {
                        const toolInvocation = part.toolInvocation;

                        if (
                          toolInvocation.toolName === "createCalendarMeeting"
                        ) {
                          const args = createCalendarMeeting.parameters.parse(
                            toolInvocation.args
                          );
                          if (toolInvocation.state === "call") {
                            return (
                              <div
                                key={toolInvocation.toolCallId}
                                className="my-3 w-full"
                              >
                                <CalendarConfirmation
                                  key={toolInvocation.toolCallId}
                                  title={args.title}
                                  startDate={args.startDate}
                                  endDate={args.endDate}
                                  attendees={args.attendees}
                                  description={args.description}
                                  location={args.location}
                                  toolCallId={toolInvocation.toolCallId}
                                  onConfirm={addToolResult}
                                />
                              </div>
                            );
                          }

                          if (toolInvocation.state === "result") {
                            const approvalState =
                              toolInvocation.result ===
                                CALENDAR_APPROVAL.Success ||
                              toolInvocation.result === APPROVAL.YES
                                ? "success"
                                : "denied";

                            return (
                              <div
                                key={toolInvocation.toolCallId}
                                className="my-3 w-full"
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
                        }
                      }

                      return null;
                    })}
                    
                  </div>
                  <div
                      className={`w-10 h-10  border ${
                        message.role === "user"
                          ? "rounded-md  border-white"
                          : "bg-black border-purple-300 rounded-md"
                      } flex items-center justify-center shadow-sm`}
                    >
                      {message.role === "user" ? (
                        <div className=" text-white w-5 h-5 flex items-center justify-center">
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
              <div ref={messagesEndRef} />
            </div>
          </Card>

          <form onSubmit={submitUserMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me to schedule a meeting..."
              className="flex-1 h-full"
            />
            <Button type="submit" size={"lg"}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
