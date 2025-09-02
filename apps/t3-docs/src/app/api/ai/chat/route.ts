import { getAiModel } from "@/lib/utils";
import { ModelMessage, streamText } from "ai";

interface ChatRequest {
  llm: {
    name: string;
    provider: string;
  };
  messages: ModelMessage[];
  role: string;
  slang: string;
}

export async function POST(req: Request) {
  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages,
    model: getAiModel(llm.provider, llm.name),
    system: `You are a helpful expert in front-end development with deep knowledge of all front-end frameworks. You explain like a ${role} with ${slang} slang. Your outputs are a visual diagram, key concepts, best practices, and a summary.`,
  });

  const response = result.toTextStreamResponse();

  return response;
}
