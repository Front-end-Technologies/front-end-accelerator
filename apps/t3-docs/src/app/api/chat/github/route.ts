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
import { auth } from "@/auth";

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
  const { llm, messages, role, slang } = (await req.json()) as ChatRequest;

  const session = await auth();

  const githubClient = await experimental_createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("https://api.githubcopilot.com/mcp"),
      {
        requestInit: {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session?.token.access_token}`,
          },
        },
      },
    ),
    name: "github-copilot-mcp-client",
  });

  const githubTools = await githubClient.tools();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: getAiModel(llm.provider, llm.name),
    system: `You are a senior front-end engineering assistant. Use clear, concise, and professional language consistent with the role of ${role}, and use ${slang} as appropriate. You are connected to the GitHub Copilot MCP server and must prioritize information from the GitHub organization "${process.env.NEXT_PUBLIC_GITHUB_USER}" and the repository "${process.env.NEXT_PUBLIC_GITHUB_REPO}". Always make MCP requests as the organization.

If you cannot find any relevant information, respond: "I don't know — no relevant content found in the organization's MCP results." Then suggest an answer based on your own knowledge, but clearly indicate it is not from the MCP server. Always include references to the articles you used from the MCP server in a bullet list format.`,
    tools: { ...githubTools } as ToolSet,
    stopWhen: stepCountIs(50),
    onFinish: async () => {
      await githubClient.close();
    },
    onError: async () => {
      await githubClient.close();
    },
  });
  return result.toUIMessageStreamResponse();
}
