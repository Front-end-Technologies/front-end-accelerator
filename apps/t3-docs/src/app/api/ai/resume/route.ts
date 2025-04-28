import { getAiModel } from "@/lib/utils";
import { streamText } from "ai";

interface ResumeRequest {
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
}

export async function POST(req: Request) {
  try {
    const { framework, llm, payload, role, slang } =
      (await req.json()) as ResumeRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      // this can be a structured output
      prompt: `Discuss this topic: ${payload}. Provide a summary, key concepts, and best practices.`,
      system: `You are an expert in front-end development with deep knowledge of ${framework.input}. You are a helpful assistant that provides information about the latest front-end technologies and frameworks. You are using the vocabulary that a ${role} would use in the following slang: ${slang}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
