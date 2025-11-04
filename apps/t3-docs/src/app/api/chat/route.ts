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
          Authorization: `Bearer ALhJN2IYO2v0I37Il5DPScdo4JiVCzv6:NSCHTYzZrIA6I1eb9jUCQUNDOOZEpJEG`,
        },
      },
    },
  );
  const mcpClient = await experimental_createMCPClient({
    transport: httpTransport,
  });

  const mcpTools = await mcpClient.tools();

  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: getAiModel(llm.provider, llm.name),
    system: `You are a highly competent front-end engineering assistant. Speak like a ${role} using ${slang} language, but remain precise and professional. Provide answers first from the Cegeka Bookstack Wiki, especially in the architect book, Front-end chapter. If nothing is found, provide your best answer based on your knowledge.`,
    tools: { ...mcpTools } as ToolSet,
    stopWhen: stepCountIs(5),
    onFinish: async () => {
      await mcpClient.close();
    },
    onError: async () => {
      await mcpClient.close();
    },
  });

  return result.toUIMessageStreamResponse();
}
