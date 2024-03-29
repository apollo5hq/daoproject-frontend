# Frontend for DAOProject

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

# Setting up metamask for development (Mumbai Testnet)

- Create a test account in your metamask if you haven't already
- Add the mumbai test net to your metamask
  - Network Name: Mumbai Testnet
  - RPC URL: https://rpc-mumbai.matic.today
  - Chain Id: 80001
  - Symbol: MATIC
  - Block Explorer URL: https://mumbai.polygonscan.com
- Request test matic from the mumbai faucet at https://faucet.polygon.technology/

# Setting up metamask for development (Rinkeby Testnet)

- Create a test account in your metamask if you haven't already
- Request test ether from https://faucets.chain.link/rinkeby

# YOU MUST DEPLOY THE SMART CONTRACT FROM DAOPROJECT-CONTRACTS FIRST BEFORE GOING ANY FURTHER

# Setting up frontend

- Copy the entire contents of the abi file in artifacts/contracts/ERC721.sol/NFT.json from daoprojects-contracts
- In the root directory here, create a file named nftABI.json and paste the abi inside of it
- Copy the contract address logged in your terminal from deploying the smart contract and set it inside the CONTRACT_ADDRESS variable inside of the MintNFTButton file.

# Test minting NFT

- Make sure your metamask is on the Rinkeby testnet
- Click mint button
- Once deployed, set the address of the NFT contract returned in the terminal to the CONTRACT_ADDRESS variable in the MintNFTButton comp
- Once mint is successful, your NFT will appear in your account at https://testnets.opensea.io/ within 5 - 10 minutes
