export const githubApiURL = `${process.env.NEXT_PUBLIC_GITHUB_API_URL}/repos/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}`;
export const githubRepoURL = `https://www.github.com/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}`;

export enum Frameworks {
  ANGULAR = "angular",
  NEXT = "next",
  NUXT = "nuxt",
  REACT = "react",
  SVELTE = "svelte",
  VUE = "vue",
}

export enum Providers {
  ANTHROPIC = "anthropic",
  GOOGLE = "google",
  OPENAI = "openai",
}

export const llm = [
  {
    description: "Google Gemini 2.5 Pro Experimental 03-25",
    name: "gemini-2.5-pro-exp-03-25",
    provider: "google",
  },
  {
    description: "Google Gemini 2.0 Flash 001",
    name: "gemini-2.0-flash-001",
    provider: "google",
  },
  {
    description: "Google Gemini 1.5 Flash (Latest)",
    name: "gemini-1.5-flash-latest",
    provider: "google",
  },
  {
    description: "Google Gemini 1.5 Pro (Latest)",
    name: "gemini-1.5-pro-latest",
    provider: "google",
  },
  {
    description: "OpenAI GPT-3 Mini",
    name: "o3-mini",
    provider: "openai",
  },
  {
    description: "OpenAI GPT-4 Mini",
    name: "o4-mini",
    provider: "openai",
  },
  {
    description: "OpenAI GPT-4.1",
    name: "gpt-4.1",
    provider: "openai",
  },
  {
    description: "OpenAI GPT-4.1 Mini",
    name: "gpt-4.1-mini",
    provider: "openai",
  },
  {
    description: "OpenAI GPT-4.1 Nano",
    name: "gpt-4.1-nano",
    provider: "openai",
  },
  {
    description: "OpenAI GPT-4o Mini",
    name: "gpt-4o-mini",
    provider: "openai",
  },
  {
    description: "Anthropic Claude 3.5 Haiku (Latest)",
    name: "claude-3-5-haiku-latest",
    provider: "anthropic",
  },
  {
    description: "Anthropic Claude 3.5 Sonnet (Latest)",
    name: "claude-3-5-sonnet-latest",
    provider: "anthropic",
  },
  {
    description: "Anthropic Claude 3 Opus (Latest)",
    name: "claude-3-opus-latest",
    provider: "anthropic",
  },
];
