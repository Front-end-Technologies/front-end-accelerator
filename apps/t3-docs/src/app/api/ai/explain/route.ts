import { getAiModel } from "@/lib/utils";
import { streamText } from "ai";

interface ExplainRequest {
  code: string;
  framework: {
    input: string;
    output: string;
  };
  llm: {
    name: string;
    provider: string;
  };
  role: string;
  slang: string;
}

export async function POST(req: Request) {
  try {
    const { code, framework, llm, role, slang } =
      (await req.json()) as ExplainRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      prompt: `Explain the following code snippet \n\n${code}`,
      system: `You are a helpful expert in front-end development with deep knowledge of ${framework}. You explain like a ${role} with a ${slang} slang. Your outputs are a visual diagram, key concepts, best practices, and a summary.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
