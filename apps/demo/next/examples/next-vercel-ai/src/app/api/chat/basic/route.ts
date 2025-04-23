import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system message with current date information
  const systemMessage = `Be a positive assistant.
    Format for notion. Use titles and subtitles.
    Use emojis to make the conversation more engaging.
  `;

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemMessage,
    messages: messages,
    onError: (error) => {
      console.error("Error:", error);
    }
  });

  return result.toDataStreamResponse();
}
