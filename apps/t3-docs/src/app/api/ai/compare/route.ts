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
      prompt: `Translate the "${framework.input}" code to "${framework.output}" code. Example translating from JavaScript to Python: JavaScript code: for (let i = 0; i < 10; i++) { console.log(i); } Python code: for i in range(10): print(i) \n\n${code}`,
      system: `You are a helpful expert in front-end development with deep knowledge of ${framework.input} and ${framework.output}. You explain like a ${role} with a ${slang} slang. Your outputs are 2 codeblocks emphasizing the differences and similarities between the two languages.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
