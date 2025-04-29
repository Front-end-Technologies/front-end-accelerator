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
    description: "Best for complex reasoning and advanced problem-solving.",
    name: "gemini-2.5-pro-exp-03-25",
    provider: "google",
  },
  {
    description: "Ideal for real-time chatbots and live support.",
    name: "gemini-2.0-flash-001",
    provider: "google",
  },
  {
    description: "Great for summarization, Q&A, and content drafting.",
    name: "gemini-1.5-flash-latest",
    provider: "google",
  },
  {
    description: "Reliable for technical writing and code generation.",
    name: "gemini-1.5-pro-latest",
    provider: "google",
  },
  {
    description: "Suited for lightweight mobile and embedded apps.",
    name: "o3-mini",
    provider: "openai",
  },
  {
    description: "Efficient for quick prototyping and low-latency tasks.",
    name: "o4-mini",
    provider: "openai",
  },
  {
    description: "Excels at advanced reasoning and content creation.",
    name: "gpt-4.1",
    provider: "openai",
  },
  {
    description: "Faster for scalable deployments with moderate complexity.",
    name: "gpt-4.1-mini",
    provider: "openai",
  },
  {
    description: "Best for IoT and edge computing with minimal resources.",
    name: "gpt-4.1-nano",
    provider: "openai",
  },
  {
    description: "Optimized for domain-specific chatbots.",
    name: "gpt-4o-mini",
    provider: "openai",
  },
  {
    description: "Great for brainstorming and creative writing.",
    name: "claude-3-5-haiku-latest",
    provider: "anthropic",
  },
  {
    description: "Best for structured outputs and workflow automation.",
    name: "claude-3-5-sonnet-latest",
    provider: "anthropic",
  },
  {
    description: "Robust for enterprise and high-volume content generation.",
    name: "claude-3-opus-latest",
    provider: "anthropic",
  },
];
