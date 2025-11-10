"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, CircleStop, Braces } from "lucide-react";
import { FormEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatEmpty from "./chat-empty";

import { ChatQuickActions } from "./chat-quick-action";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { itinerarySchema } from "@/app/api/chat/structured-outputs/schema";
import TravelItineraryViewer from "../travel-itenary-viewer";
import { QuickAction } from "@/lib/types/quick-action";

const quickActions: QuickAction[] = [
  {
    section: "structured-outputs",
    label: "A 5-day trip to Belgium",
    value: `Create a detailed travel itinerary for a ${5}-day trip to ${"Belgium"}. The traveler is interested in: ${"Programming, Gaming, Darts"}. Include daily activities, accommodations, and local tips.`,
  },
  {
    section: "structured-outputs",
    label: "A 3-day trip to Paris",
    value: `Create a detailed travel itinerary for a ${3}-day trip to ${"Paris"}. I am interested in: ${"History, monuments"}. Include daily activities, accommodations, and local tips.`,
  },
  {
    section: "structured-outputs",
    label: "A 7-day trip to London",
    value: `Create a detailed travel itinerary for a ${7}-day trip to ${"London"}. I am interested in: ${"Christmas, History, Monuments, Shopping"}. Include daily activities, accommodations, and local tips.`,
  },
];

export function ChatStructuredOutputs() {
  const [prevInput, setPrevInput] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showStructuredOutput, setShowStructuredOutput] = useState(false);

  const { submit, isLoading, object, stop, error } = useObject({
    api: "/api/chat/structured-outputs",
    schema: itinerarySchema,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const submitInput = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
    setPrevInput(input);
    setInput("");
  };

  const handleCopy = () => {
    const codeContent = JSON.stringify(object, null, 2) || "";
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <>
      {object && (
        <Button
          className="mb-4 bg-purple-300 hover:bg-purple-500 hover:cursor-pointer"
          onClick={() => setShowStructuredOutput(!showStructuredOutput)}
        >
          <Braces />
          {!showStructuredOutput ? "Show" : "Hide"} structured output
        </Button>
      )}

      <Card className="flex-1 overflow-y-auto flex flex-col mb-4">
        <div className="flex-1 p-4">
          {!object && !isLoading && (
            <div className="h-full flex items-center justify-center">
              <ChatEmpty />
            </div>
          )}

          {error && (
            <div className="mt-4">
              <div className="text-red-500">
                An error occurred. {error.message}
              </div>
            </div>
          )}

          {prevInput && (
            <div className="flex gap-2 md:gap-4 justify-end items-center mb-4">
              <div className="rounded-lg px-4 bg-primary text-primary-foreground md:max-w-[80%] py-2">
                <div>
                  <p>{prevInput}</p>
                </div>
              </div>
              <div className="basis-10 w-10 h-10 border bg-black border-purple-300 rounded-md flex items-center justify-center shadow-sm">
                <div className="text-white w-5 h-5 flex items-center justify-center">
                  BB
                </div>
              </div>
            </div>
          )}

          {object && (
            <div className="flex gap-4 justify-start">
              <div className="basis-10 w-10 h-10 border bg-black border-purple-300 rounded-md flex items-center justify-center shadow-sm">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={"/vercel.svg"} />
                  <AvatarFallback>BB</AvatarFallback>
                </Avatar>
              </div>
              <div className="w-full">
                {showStructuredOutput && (
                  <div className="relative group">
                    <button
                      onClick={handleCopy}
                      className="absolute top-4 right-2 bg-purple-500 text-white text-sm px-2 py-1 rounded lg:opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <div className="max-h-[400px] rounded-lg border overflow-auto border-gray-700 bg-gray-900 p-4 mb-4">
                      <pre className="text-purple-300  ">
                        {JSON.stringify(object, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                <TravelItineraryViewer
                  itinerary={object}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* <div ref={messagesEndRef} /> */}
        </div>
      </Card>

      <ChatQuickActions quickActions={quickActions} setInput={setInput} />

      <form onSubmit={submitInput} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me to schedule a meeting..."
          className="flex-1 h-full"
        />

        {isLoading ? (
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
