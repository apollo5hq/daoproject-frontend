# Website starter With Next.js

## How to use

Create .secret file in root directory

- Create test account and copy test account's private key, then paste into .secret file

Locally, install it and run:

```sh
yarn
# If testing smart contracts run the following script to deploy the contract
# Then place the private key of your test account inside of the .secret file before running 'yarn dev'
yarn deploy_contract
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

# Setting up metamask for development

- Create a test account in your metamask if you haven't already
- Add the mumbai test net to your metamask
  - Network Name: Mumbai Testnet
  - RPC URL: https://rpc-mumbai.matic.today
  - Chain Id: 80001
  - Symbol: MATIC
  - Block Explorer URL: https://mumbai.polygonscan.com
- Request test matic from the mumbai faucet at https://faucet.polygon.technology/

# Deploying the NFT smart contract

```shell
# Locally
npx hardhat node & npx hardhat run scripts/deploy.js --network localhost
```

```shell
# Test net
npx hardhat run scripts/deploy.js --network mumbai
```

```shell
# mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

# Test minting NFT

- Deploy contract
- Once deployed, set the address of the NFT contract from the terminal to the CONTRACT_ADDRESS variable in the MintNFTButton comp
- Copy and paste the private key of your test account inside the .secret file
- Make sure metamask is on the mumbai testnet
- Once mint is successful, your NFT will appear in your account at https://testnets.opensea.io/ within 5 - 10 minutes
