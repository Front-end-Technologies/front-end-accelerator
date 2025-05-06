import { getAiModel } from "@/lib/utils";
import { streamText } from "ai";

interface SummaryRequest {
  framework: {
    input: string;
    output: string;
  };
  llm: {
    name: string;
    provider: string;
  };
  payload: string;
  role: string;
  slang: string;
  uri?: string;
}

export async function POST(req: Request) {
  try {
    const { framework, llm, payload, role, slang, uri } =
      (await req.json()) as SummaryRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      prompt: `${uri ? `Make a summary from the content on this uri ${uri}` : `Discuss this topic: ${payload}.`}`,
      system: `You are a helpful expert in front-end development with deep knowledge in ${framework}. You explain like a ${role} with a ${slang} slang. Your output should be a summary.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
