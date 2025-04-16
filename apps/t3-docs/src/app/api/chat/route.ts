import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ChatMessage {
  content: string;
  role: "assistant" | "system" | "user";
}

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const result = streamText({
    messages,
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    // system:
    //   "You are a highly skilled code generation assistant. Your sole purpose is to write clean, efficient, and correct code based on the user's request. Do not provide any explanations, introductions, apologies, or conversational text. Do not wrap the code in markdown code blocks. Output only the raw code requested. If the request is unclear or cannot be fulfilled with code, output only '// Error: Request is unclear or cannot be fulfilled.'",
  });

  return result.toDataStreamResponse();
}
