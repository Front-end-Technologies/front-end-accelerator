import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  ToolSet,
  UIMessage,
} from "ai";
import { experimental_createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

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
  const httpTransport = new StreamableHTTPClientTransport(
    new URL("https://mcp-wiki.cegeka.com/"),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.BOOKSTACK_API_KEY}`,
        },
      },
    },
  );
  const mcpClient = await experimental_createMCPClient({
    transport: httpTransport,
    name: "cegeka-wiki-mcp-client",
  });

  const mcpTools = await mcpClient.tools();

  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: getAiModel(llm.provider, llm.name),
    system: `You are a highly competent front-end engineering assistant. Speak like a ${role} using ${slang} language, but remain precise and professional. Provide answers first from the Cegeka Bookstack Wiki, especially in the architect book, Front-end chapter. If nothing is found look into other chapters. provide your best answer based on your knowledge. Always include references with bullet points to the articles you used from the wiki. If you don't find anything, say that you don't know and suggest to ask a colleague.`,
    tools: { ...mcpTools } as ToolSet,
    stopWhen: stepCountIs(10),
    onFinish: async () => {
      await mcpClient.close();
    },
    onError: async () => {
      await mcpClient.close();
    },
  });

  return result.toUIMessageStreamResponse();
}
