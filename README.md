# Website starter With Next.js

## How to use

Locally, install it and run:

```sh
yarn
yarn dev
```

Or use [Gitpod](https://www.gitpod.io/docs/gitlab-integration)

## <!-- #default-branch-switch -->

## What's Under the Hood?

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you prefer, you can [use styled-components instead](https://mui.com/guides/interoperability/#styled-components).

State management

- Redux-toolkit

Forms

- [Formik](https://github.com/jaredpalmer/formik)
- [Formik-mui](https://github.com/stackworx/formik-mui)

Formatting

- [Prettier](https://github.com/prettier/prettier)
- Eslint

Automated Formatting:

- husky
- lint-staged

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

<!-- Deploying the NFT smart contract  -->

```shell
 # Test net
npx hardhat run scripts/deploy.js --network mumbai

# mainnet
npx hardhat run scripts/deploy.js --network mainnet
```
