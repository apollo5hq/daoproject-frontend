import { ethers } from "ethers";

export type Network =
  | "Ethereum Mainnet"
  | "Rinkeby Testnet"
  | "Polygon Mainnet"
  | "Mumbai Testnet"
  | "UNSUPPORTED NETWORK";

export type ChainId = "0x1" | "0x4" | "0x89" | "137" | "0x13881" | "80001";

/**
 * Fetches the user's metamask accounts. The "currently selected" address is the first item in the array.
 * @returns An array of account addresses
 */
export const requestAccounts = async () => {
  const { ethereum } = window;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts as string[];
};
/**
 * Fetches metamask accounts
 * @returns Object containing wallet address, avatar and ENS domain
 * */
export const getAccounts = async (address: string) => {
  // Get ethereum web3 provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Create a signer
  // const signer = provider.getSigner();
  // Get wallet address
  // const address = await signer.getAddress();
  // Get ens domain name
  let avatar: string | null = null;
  let ens: string | null = null;
  // If user is on ethereum networks
  if (window.ethereum.chainId === "0x1") {
    ens = await provider.lookupAddress(address);
    if (ens) {
      avatar = await provider.getAvatar(ens);
    }
  }
  return {
    address,
    avatar,
    ens,
    chainId: window.ethereum.chainId,
  };
};

/**
 * Returns a user friendly network string based on the selected network
 * @returns Network name as a string
 * */
export const selectNetwork = (chainId: ChainId) => {
  switch (chainId) {
    case "0x1":
      return "Ethereum Mainnet";
    case "0x4":
      return "Rinkeby Testnet";
    case "0x89":
    case "137":
      return "Polygon Mainnet";
    case "0x13881":
    case "80001":
      return "Mumbai Testnet";
    default:
      return "UNSUPPORTED NETWORK";
  }
};

/**
 * An array of all the networks our dapp supports
 * */
export const supportedChains: ChainId[] = [
  "0x1",
  "0x4",
  "137",
  "80001",
  "0x89",
  "0x13881",
];
