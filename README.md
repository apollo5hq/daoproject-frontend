# Website starter With Next.js

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

# Setting up metamask for development

- Create a test account in your metamask if you haven't already
- Add the mumbai test net to your metamask
  - Network Name: Mumbai Testnet
  - RPC URL: https://rpc-mumbai.matic.today
  - Chain Id: 80001
  - Symbol: MATIC
  - Block Explorer URL: https://mumbai.polygonscan.com
- Request test matic from the mumbai faucet at https://faucet.polygon.technology/

# Test minting NFT

- Deploy contract
- Once deployed, set the address of the NFT contract from the terminal to the CONTRACT_ADDRESS variable in the MintNFTButton comp
- Copy and paste the private key of your test account inside the .secret file
- Make sure metamask is on the mumbai testnet
- Once mint is successful, your NFT will appear in your account at https://testnets.opensea.io/ within 5 - 10 minutes
