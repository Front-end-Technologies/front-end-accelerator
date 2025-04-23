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
    const { code, llm, role, slang } = (await req.json()) as ExplainRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      prompt: `Your are the Technical Expert Front-end Technologies that knows all Front-end Frameworks. Colleague developers ask you to explain code snippets. Use the vocabulary that a ${role} would use in the following slang: ${slang}. This is the code snippet: ${code}.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
