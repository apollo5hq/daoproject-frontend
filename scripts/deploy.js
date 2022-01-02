const main = async () => {
  // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory
  const nftContractFactory = await hre.ethers.getContractFactory("NFT");
  // Create a local ethereum env only for this contract the destorys it after the script completes
  const nftContract = await nftContractFactory.deploy();
  // Wait til the contract is minted and deployed to the blockchain
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
