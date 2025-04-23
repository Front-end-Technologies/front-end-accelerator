import { getAiModel } from "@/lib/utils";
import { CoreMessage, streamText } from "ai";

interface ChatRequest {
  llm: {
    name: string;
    provider: string;
  };
  messages: CoreMessage[];
}

export async function POST(req: Request) {
  const { llm, messages } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages,
    model: getAiModel(llm.provider, llm.name),
    system: "You are a helpful assistant.",
  });

  const response = result.toDataStreamResponse();

  return response;
}
