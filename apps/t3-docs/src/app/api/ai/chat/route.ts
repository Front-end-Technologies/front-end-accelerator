import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  ModelMessage,
  streamText,
  UIMessage,
} from "ai";

import { getAiModel } from "@/lib/utils";

interface ChatRequest {
  llm: {
    name: string;
    provider: string;
  };
  messages: ModelMessage[];
  role: string;
  slang: string;
}

// export async function POST(req: Request) {
//   const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

//   const result = streamText({
//     messages: convertToModelMessages(messages),
//     model: getAiModel(llm.provider, llm.name),
//     // system: `You are a helpful expert in front-end development with deep knowledge of all front-end frameworks. You explain like a ${role} with ${slang} slang. Your outputs are a visual diagram, key concepts, best practices, and a summary.`,
//   });

//   const response = result.toTextStreamResponse();

//   return response;
// }

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("messages: ", messages);

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openai("gpt-4.1"),
    system: "You are a helpful assistant.",
  });

  return result.toUIMessageStreamResponse();
}
