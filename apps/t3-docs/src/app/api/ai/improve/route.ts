import { getAiModel } from "@/lib/utils";
import { streamText } from "ai";

interface ImproveCodeRequest {
  code: string;
  framework: {
    input: string;
  };
  llm: {
    name: string;
    provider: string;
  };
}

export async function POST(req: Request) {
  try {
    const { code, framework, llm } = (await req.json()) as ImproveCodeRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      prompt: `Improve the following code snippet \n\n${code}`,
      system: `You are code generator with deep knowledge of ${framework.input}. You generate code only, that is improved, more readable, maintainable, and aligned with best practices. Do not output any explanation, comments, markup, markdown or tags. Output code only. You add comments emphasizing the improvements made.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
