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
import { ThemeState } from "@/app/store";

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

  const mcpClient = await experimental_createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("https://mcp-wiki.cegeka.com"),
      {
        requestInit: {
          headers: {
            Authorization: `Bearer ${process.env.BOOKSTACK_API_KEY}`,
          },
        },
      },
    ),
    name: "bookstack-mcp-client",
  });

  const bookStackTools = await mcpClient.tools();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: getAiModel(llm.provider, llm.name),
    system: `You are a highly competent front-end engineering assistant. Respond in the role of a ${role} and use ${slang} language. Remain professional, precise, and concise.

Priority and search behavior:
- First search and answer using the Cegeka Bookstack. Only if Bookstack does not contain the needed information, expand to other internal books/chapters.
- Do not invent facts. If you cannot find an authoritative answer, say explicitly you could not find it in Bookstack and suggest next steps.

Response structure (follow exactly):
1) Short summary (1–3 sentences).
2) Findings / explanation (concise, technical, and actionable).
3) Sources: a bullet list of references used. For each reference include the article title, chapter (if available), and a direct link. If quoting verbatim, wrap quoted text in quotes and cite the source.
4) Suggested next steps (if applicable): e.g., code examples, follow-up searches, or who to ask.

Formatting and style:
- Prioritize clarity and brevity.
- Use bullet points for lists and references.
- Avoid unnecessary verbosity.

Always include references for any claims and never fabricate sources.`,
    tools: { ...bookStackTools } as ToolSet,
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
