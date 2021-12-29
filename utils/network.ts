import { ethers } from "ethers";

export async function createBytes(args: string[]) {
  const name = args[0];
  const bytes = ethers.utils.formatBytes32String(name);
  console.log("Bytes: ", bytes);
}
