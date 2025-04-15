import { sendEmail } from "@/lib/tools/email-tools";
import { getWeather } from "@/lib/tools/weather-tools";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system message with current date information
  const systemMessage = `Be a positive assistant.
    Format for notion. Use titles and subtitles.
    Use emojis to make the conversation more engaging.

    When sending a mail also provide the user with a summary of the email content.
    For weather requests, use the getWeather tool to fetch the current weather information.
  `;

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemMessage,
    messages: messages,
    maxSteps: 10,
    tools: {sendEmail, getWeather}
  });

  return result.toDataStreamResponse();
}
