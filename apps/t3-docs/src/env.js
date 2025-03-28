// /* eslint-disable no-undef */
// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//   client: {},
//   emptyStringAsUndefined: true,
//   runtimeEnv: {
//     AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
//     AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
//     AUTH_SECRET: process.env.AUTH_SECRET,
//     BASE_URL: process.env.BASE_URL,
//     GITHUB_API_URL: process.env.GITHUB_API_URL,
//     GITHUB_REPO: process.env.GITHUB_REPO,
//     GITHUB_USER: process.env.GITHUB_USER,
//     NODE_ENV: process.env.NODE_ENV,
//     OPENAI_API_KEY: process.env.OPENAI_API_KEY,
//   },
//   server: {
//     AUTH_GITHUB_ID: z.string(),
//     AUTH_GITHUB_SECRET: z.string(),
//     AUTH_SECRET:
//       process.env.NODE_ENV === "production"
//         ? z.string()
//         : z.string().optional(),
//     BASE_URL: z.string(),
//     GITHUB_API_URL: z.string(),
//     GITHUB_REPO: z.string(),
//     GITHUB_USER: z.string(),
//     NODE_ENV: z
//       .enum(["development", "test", "production"])
//       .default("development"),
//     OPENAI_API_KEY: z.string(),
//   },
//   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
// });
