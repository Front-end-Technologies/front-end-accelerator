import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { itinerarySchema } from "./schema";

export async function POST(req: Request) {
  const prompt = await req.json();

  const result = streamObject({
    model: google("gemini-2.0-flash-001"),
    schema: itinerarySchema,
    system:
      "You are an expert travel planner with knowledge of destinations worldwide. Create detailed, realistic itineraries.",
    prompt
  });

  return result.toTextStreamResponse();
}
