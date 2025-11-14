import { url } from "inspector";

export const githubRepoURL = `https://www.github.com/${process.env.NEXT_PUBLIC_GITHUB_USER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}`;

export enum Framework {
  ANGULAR = "angular",
  NEXT = "next",
  NUXT = "nuxt",
  REACT = "react",
  SVELTE = "svelte",
  VUE = "vue",
}

export enum Provider {
  ANTHROPIC = "anthropic",
  GOOGLE = "google",
  OPENAI = "openai",
}

export enum Type {
  COOKBOOK = "cookbook",
  EXAMPLES = "examples",
}

export const llm = [
  {
    description: "Good for looking up information quickly.",
    name: "gemini-2.5-flash",
    provider: "google",
  },
  {
    description: "Cheap and fast, but not so smart.",
    name: "gpt-4.1-nano",
    provider: "openai",
  },
  {
    description: "Smart but slow",
    name: "gpt-5",
    provider: "openai",
  },
  {
    description: "Still smart, still slow, but cheaper.",
    name: "gpt-5-mini",
    provider: "openai",
  },
  {
    description: "Fast and capable for most tasks. But slow in reasoning.",
    name: "gpt-5-nano",
    provider: "openai",
  },
  {
    description: "Excellent for coding tasks and complex problem solving.",
    name: "claude-3-7-sonnet-20250219",
    provider: "anthropic",
  },
];

export const mcps = [
  {
    description:
      "Ask questions or give tasks based on the Front-end Accelerator code repo",
    name: "github-copilot-mcp-client",
    provider: "GitHub",
    url: "https://api.githubcopilot.com/mcp",
    route: "/api/chat/github",
  },
  {
    description:
      "Ask questions or give tasks based on the Cegeka Bookstack Wiki",
    name: "bookstack-mcp-client",
    provider: "Bookstack",
    url: "https://mcp-wiki.cegeka.com",
    route: "/api/chat/bookstack",
  },
];
