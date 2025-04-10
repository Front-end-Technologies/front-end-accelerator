# Front-end Accelerator Monorepo

This is a monorepo based on pnpm workspaces and Turborepo. Maintainted by Cegeka's Front-end Guild

Currently deployed at: https://front-end-accelerator-t3-docs.vercel.app/

https://cegekagroup.sharepoint.com/sites/O-AP-ApplicationsGeneral/SitePages/Front-end-Technologies.aspx

## Using this monorepo

Run the following command:

```sh
pnpm install
pnpm build
```

This will install all dependencies for all apps and packages in the monorepo.
You can also run the following command to install dependencies for a specific app or package:

```sh
pnpm i --filter <package-name>
```
This will install all dependencies for the specified app or package.

You can also open an app in a separate code editor and work on the app as if it were a standalone app


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `demo`: this folder contains all our cookbook recipes and examples
- `t3-docs`: a Next.js app that showcases the power of the T3 stack, documenting our cookbook recipes
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [WebContainers](https://webcontainers.io/) for running Node.js apps directly in the browser

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Remote Caching

Only available on Vercel, not on Azure.

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)


