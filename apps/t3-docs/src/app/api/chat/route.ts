import { convertToModelMessages, streamText, UIMessage } from "ai";

import { getAiModel } from "@/lib/utils";

interface ChatRequest {
  llm: {
    name: string;
    provider: string;
  };
  messages: UIMessage[];
  role: string;
  slang: string;
}

export async function POST(req: Request) {
  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: getAiModel(llm.provider, llm.name),
    system: `You are a highly competent front-end engineering assistant. Speak like a ${role} using ${slang} slang, but remain precise and professional. Deliver the response in plain text following the structure above. Keep the tone matching the requested slang, but ensure accuracy and usefulness.`,
  });

  return result.toUIMessageStreamResponse();
}
