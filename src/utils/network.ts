import { ethers } from "ethers";
/**
 * Fetches metamask accounts
 * @returns Object containing wallet address, avatar and ENS domain
 * */
export const getAccounts = async () => {
  // Get ethereum web3 provider
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  // Create a signer
  const signer = provider.getSigner();
  // Get wallet address
  const address = await signer.getAddress();
  // Get ens domain name
  let avatar: string | null = null;
  let ens: string | null = null;
  if ((window as any).ethereum.chainId === "0x1")
    ens = await provider.lookupAddress(address);
  if (ens) {
    avatar = await provider.getAvatar(ens);
  }
  return {
    address,
    avatar,
    ens,
    chainId: (window as any).ethereum.chainId,
  };
};

/**
 * Returns a user friendly network string based on the selected network
 * @returns Network name as a string
 * */
export const selectNetwork = (chainId: string) => {
  switch (chainId) {
    case "0x1":
      return "Ethereum Main Network";
    case "0x3":
      return "Ropsten Test Network";
    case "0x4":
      return "Rinkeby Test Network";
    case "0x5":
      return "Goerli Test Network";
    case "0x2a":
      return "Kovan Test Network";
    case "0x89":
    case "137":
      return "Polygon Main Network";
    case "0x13881":
    case "80001":
      return "Mumbai Test Network";
    default:
      return "UNSUPPORTED NETWORK";
  }
};

/**
 * An array of all the networks our dapp supports
 * */
export const supportedChains = [
  "0x1",
  "0x3",
  "0x4",
  "0x5",
  "0x2a",
  "137",
  "80001",
  "0x89",
  "0x13881",
];
