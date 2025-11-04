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
    description: "Your everyday versatile assistant",
    name: "gemini-2.5-flash",
    provider: "google",
  },
  {
    description: "Good for repeatable tasks and structured outputs.",
    name: "gpt-5",
    provider: "openai",
  },
  {
    description: "Faster than gtp-5 with slightly lower accuracy.",
    name: "gpt-5-mini",
    provider: "openai",
  },
  {
    description: "Balanced model for general-purpose use.",
    name: "gpt-5-nano",
    provider: "openai",
  },
  {
    description: "Lightweight and fast model for quick responses.",
    name: "gpt-4.1-mini",
    provider: "openai",
  },
  {
    description: "Excellent for coding tasks and complex problem solving.",
    name: "claude-3-7-sonnet-20250219",
    provider: "anthropic",
  },
];
