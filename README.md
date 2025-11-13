Front-end Accelerator – Quick Start

Prerequisites
- Node.js installed
- pnpm installed (npm i -g pnpm)

Install dependencies
- pnpm install

Build
- pnpm build

Run development server
- pnpm dev

Run a specific app/package
- pnpm install
- pnpm dev --filter <package-name>

Optional: Build then run
- pnpm build
- pnpm dev

Notes
- This monorepo uses pnpm workspaces and Turborepo.

```
pnpm install
pnpm build
pnpm dev
```

```
pnpm install
pnpm dev --filter <package-name>
```
