import { getAiModel } from "@/lib/utils";
import { streamText } from "ai";

interface CompareRequest {
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
      (await req.json()) as CompareRequest;

    const result = streamText({
      model: getAiModel(llm.provider, llm.name),
      prompt: `Your are the Technical Expert Front-end Technologies that knows all Front-end Frameworks. Translate the "${framework.input}" code to "${framework.output}" code. Example translating from JavaScript to Python: JavaScript code: for (let i = 0; i < 10; i++) { console.log(i); } Python code: for i in range(10): print(i) Use the vocabulary that a ${role} would use in the following slang: ${slang}. ${framework.input} code: ${code} ${framework.output} code:`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
