import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system message with current date information
  const systemMessage = `Be a positive assistant.
    Format for notion. Use titles and subtitles.
    Use emojis to make the conversation more engaging.

    If the user wants the weather of their location, ask for confirmation with the askForConfirmation tool before using the getLocation and getWeatherInformation tool.
  `;

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemMessage,
    messages: messages,
    maxSteps: 10,
    tools: {
      sendEmail: tool({
        description: "Send an email to a specified recipient",
        parameters: z.object({
          to: z.string().describe("Email address of the recipient"),
          subject: z.string().describe("Subject of the email"),
          message: z.string().describe("Body content of the email"),
        }),
        execute: async ({ to, subject, message }) => {
          return {
            status: "success",
            message: `Email sent to ${to} with subject "${subject} and message "${message}"`,
          }
        }
      }),
      // server-side tool with execute function:
      getWeatherInformation: tool({
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          // Add artificial delay of 2 seconds
          await new Promise(resolve => setTimeout(resolve, 2000));

          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      }),
      // client-side tool that starts user interaction:
      askForConfirmation: tool({
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      }),
      // client-side tool that is automatically executed on the client:
      getLocation: tool({
        description:
          'Get the user location. Always use askForConfirmation before using this tool.',
        parameters: z.object({}),
        execute: async ({}) => {
          const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      }),
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  return result.toDataStreamResponse();
}
