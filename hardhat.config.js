require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
// This is the private key to your metamask account you are using to deploy your smart contract
const privateKey = fs.readFileSync(".secret").toString();
const projectId = "x3SAFsJCm4xuqn7dWr7CdTRB0xWWvq_4";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${projectId}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: "INSERT_MAINNET_URL_HERE",
      accounts: [privateKey],
    },
  },
};
