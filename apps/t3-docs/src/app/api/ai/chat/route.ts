import { getAiModel } from "@/lib/utils";
import { CoreMessage, streamText } from "ai";

interface ChatRequest {
  llm: {
    name: string;
    provider: string;
  };
  messages: CoreMessage[];
  role: string;
  slang: string;
}

export async function POST(req: Request) {
  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages,
    model: getAiModel(llm.provider, llm.name),
    system: `You are a helpful expert in front-end development with deep knowledge of all front-end frameworks. You explain like a ${role} with a ${slang} slang. Your output should be a summary, key concepts, and best practices. You only answer front-end related questions.`,
  });

  const response = result.toDataStreamResponse();

  return response;
}
