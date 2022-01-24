import { useState, Dispatch, SetStateAction } from "react";
import { BigNumber, ethers } from "ethers";
import { useAppSelector } from "../../redux/app/hooks";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Typography, Link } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NFT from "../../../nftABI.json";

// Contract address to the ERC-721 or ERC-1155 token contract needed to create a connection to the contract
const CONTRACT_ADDRESS = "0x65da3f4Eca173B4a4A092C4ea3D6d401dBBf3ADf";
const ipfsClient = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
});

interface MintNFTProps {
  canvasRef: HTMLCanvasElement | null;
  hasMinted: boolean;
  setHasMinted: Dispatch<SetStateAction<boolean>>;
  nftCanvasRef: HTMLCanvasElement | null;
}

export default function ({
  canvasRef,
  hasMinted,
  setHasMinted,
  nftCanvasRef,
}: MintNFTProps) {
  const { data } = useAppSelector((state) => state.web3);
  const { network } = data;
  // State for whether or not the user is minting
  const [minting, setMinting] = useState<boolean>(false);
  const [link, setLink] = useState("");
  // Upload art and metadata to ipfs
  const createMetadata = async (blob: Blob) => {
    // Create file from blob
    const file = new File([blob], "testart.png", { type: "image/png" });
    // Upload file to ipfs
    const added = await ipfsClient.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    // Create metadata
    const metadata = JSON.stringify({
      name: "Test Art",
      description: "Custom drawing I made",
      image: url,
    });
    const base64string = Buffer.from(metadata).toString("base64");
    return `data:application/json;base64,${base64string}`;
  };

  const askContractToMintNft = async () => {
    if (!canvasRef) return;
    const context = nftCanvasRef?.getContext("2d");
    context?.drawImage(canvasRef, 0, 0);
    nftCanvasRef?.toBlob(
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
          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${hash}`
          );
          // Get tokenId
          const event = tx.events[0];
          const value: BigNumber = event.args[2];
          const tokenId = value.toNumber();
          // Return a link to the nft on opensea
          setHasMinted(true);
          setLink(
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`
          );
        } catch (error) {
          console.log(error);
        }
      },
      "image/png",
      1
    );
  };

  const promptNetworkChange = async () => {
    const { ethereum } = window;
    if (!ethereum) return;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x4",
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (network !== "Rinkeby Testnet") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 23,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ padding: 1 }}>
          Make sure you are on the Rinkeby Testnet
        </Typography>
        <Button variant="contained" onClick={promptNetworkChange}>
          Switch Network
        </Button>
      </div>
    );
  }
  // Check if user has claimed NFT
  if (hasMinted) {
    return (
      <div style={{ padding: 50 }}>
        <Typography gutterBottom variant="h6" align="center">
          Congrats you have minted your NFT!🥳
        </Typography>
        <Typography gutterBottom variant="h6" align="center">
          It can take up to 10 min to see your NFT on OpenSea. Here's the link:
        </Typography>
        <Typography gutterBottom variant="subtitle1" align="center">
          <Link href={link} target="_blank" underline="hover">
            {link}
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      {minting ? (
        <div style={{ paddingTop: 20 }}>Minting...</div>
      ) : (
        <Button
          data-testid="mint"
          variant="contained"
          color="secondary"
          sx={{ color: "black" }}
          onClick={askContractToMintNft}
        >
          Mint
        </Button>
      )}
    </Box>
  );
}
