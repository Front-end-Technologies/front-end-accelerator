import { google } from "@ai-sdk/google";
import {
  streamText,
} from "ai";

import { experimental_createMCPClient as createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system message with current date information
  const systemMessage = `Be a positive assistant.
    Format text for Notion.
    Use emojis to make the conversation more engaging.
    Format image links (ex: https://raw.githubusercontent.com/jamesmontemagno/app-monkeys/master/baboon.jpg") as ![image](https://raw.githubusercontent.com/jamesmontemagno/app-monkeys/master/baboon.jpg).

    When giving trivias, do not tell the answer right away. Instead, provide the answer if the user asks for it.
    `;

  try {
    const mcpClient = await createMCPClient({
      // .NET SSE MCP Server
      // transport: {
      //   type: "sse",
      //   url: "http://localhost:63499/sse",
      // },
      // Node.js MCP Server stdio
      transport: new StdioMCPTransport({
        command: 'node',
        args: ['src/mcp-server/stdio/mcp.js'],
      }),
    });

    const mcpToolSet = await mcpClient.tools();

    // Stream the text with the updated messages
    const result = streamText({
        model: google("gemini-2.0-flash-001"),
        system: systemMessage,
        messages: messages,
        maxSteps: 10,
        tools: mcpToolSet,
        onFinish: async () => {
            await mcpClient.close();
          },
      });

      return result.toDataStreamResponse();

  } catch (error) {
    console.error(error);
  }
}
