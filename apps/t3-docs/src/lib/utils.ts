import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { providers } from "./const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (error) {
    console.error("Failed to copy text to clipboard", error);
  }
}

export async function handleAIStream(
  res: Response,
  callback: (text: string) => void,
) {
  if (!res.body) throw new Error("No res body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    const decodedChunk = decoder.decode(value);

    callback(decodedChunk);

    if (done) {
      break;
    }
  }
}

export const getAiModel = (provider: string, name: string) => {
  switch (provider) {
    case providers.ANTHROPIC:
      return anthropic(name);
    case providers.GOOGLE:
      return google(name);
    case providers.OPENAI:
      return openai(name);
    // Add more cases here for other providers
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
