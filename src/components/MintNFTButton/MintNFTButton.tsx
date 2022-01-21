import { useState, FunctionComponent } from "react";
import { Button } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useAppSelector } from "../../redux/app/hooks";
import { ConnectButton } from "@/components";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Box from "@mui/material/Box";
import NFT from "../../../nftABI.json";

// Contract address to the ERC-721 or ERC-1155 token contract needed to create a connection to the contract
const CONTRACT_ADDRESS = "0x689286e2D9265a237c7eAD7D8706CE158dBd2714";
const ipfsClient = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
});

const MintNFTButton: FunctionComponent<{
  canvasRef: HTMLCanvasElement | null;
}> = ({ canvasRef }) => {
  const { data } = useAppSelector((state) => state.web3);
  const { address: userAddress, network } = data;
  // State for whether or not the user is minting
  const [minting, setMinting] = useState<boolean>(false);
  // State for whether the user has claimed the NFT or not
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  // State for the message when a user claims the NFT
  const [claimedMessage, setclaimedMessage] = useState<string>(
    "Congrats you have claimed your NFT :)"
  );

  // Upload art and metadata to ipfs
  const createMetadata = async (blob: Blob) => {
    // Create file from blob
    const file = new File([blob], "testart.png", { type: "image/png" });
    // Upload file to ipfs
    const added = await ipfsClient.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    // Create metadata
    const metadata = JSON.stringify({
      name: "Test Art",
      description: "Custom drawing I made",
      image: url,
    });
    // Upload metadata to ipfs
    const uploadMetadata = await ipfsClient.add(metadata);
    const metadataURL = `https://ipfs.infura.io/ipfs/${uploadMetadata.path}`;
    console.log(metadataURL);
    return metadataURL;
  };

  const logTransaction = (hash: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${hash}`
      );
    } else {
      console.log(`Mined, see transaction: https://etherscan.io/tx/${hash}`);
    }
  };

  const askContractToMintNft = async () => {
    canvasRef?.toBlob(
      async (blob) => {
        // TODO: Handle error message for when blob is null
        if (!blob) return;
        try {
          // Create metadata
          const url = await createMetadata(blob);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          // Create connection to NFT contract
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            NFT.abi,
            signer
          );
          console.log("Going to pop wallet now to pay gas...");
          // Begin mint
          let { hash, wait } = await contract.mint(url);
          setMinting(true);
          // Wait for mint to finish
          const tx = await wait();
          setMinting(false);
          // Log link to the transaction hash on etherscan
          logTransaction(hash);
          setHasClaimed(!hasClaimed);
          // Get tokenId
          const event = tx.events[0];
          const value: BigNumber = event.args[2];
          const tokenId = value.toNumber();
          // Return a link to the nft on opensea
          setclaimedMessage(
            `Congrats you have claimed your NFT :)\n\nIt can take up to 10 min to see your NFT on OpenSea! Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`
          );
        } catch (error) {
          console.log(error);
        }
      },
      "image/png",
      1
    );
  };

  if (!userAddress) {
    return <ConnectButton />;
  }

  if (network !== "Rinkeby Testnet") {
    return <div>Make sure you are on the Rinkeby Testnet</div>;
  }
  // Check if user has claimed NFT
  if (hasClaimed) {
    return <div>{claimedMessage}</div>;
  }

  return (
    <Box sx={{ my: 4 }}>
      {minting ? (
        <div>Minting...</div>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          sx={{ color: "black" }}
          onClick={askContractToMintNft}
        >
          Mint NFT
        </Button>
      )}
    </Box>
  );
};

export default MintNFTButton;
