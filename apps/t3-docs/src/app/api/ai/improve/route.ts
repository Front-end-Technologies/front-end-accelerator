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
      prompt: `You are an expert in front-end development with deep knowledge of all front-end frameworks. Your task is to improve the following code snippet to make it more readable, maintainable, and aligned with best practices. Focus on clarity, simplicity, and modern conventions. The framework being used is: ${framework.input}. Here is the code snippet:\n\n${code}\n\nProvide only the improved code snippet as the response. Do not include any explanations or additional comments. Do not add anything else besides the code. Don't include markdown or any other formatting. Just provive the code as text.
      Only return the improved code snippet.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
