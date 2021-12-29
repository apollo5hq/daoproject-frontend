import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useAppSelector } from "../redux/app/hooks";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";

// Contract address to the ERC-721 or ERC-1155 token contract needed to create a connection to the contract
const CONTRACT_ADDRESS = "0xc32DC21F4ff5635cc4B80454ed2508b40f3eB6Db";

export default () => {
  const { address, network } = useAppSelector((state) => state.web3.data);
  // State for whether or not the user is minting
  const [minting, setMinting] = useState<boolean>(false);
  // State holding the connected ERC-721 or ERC-1155 token contract
  const [connectedContract, setConnectedContract] = useState<ethers.Contract>();
  // State for the amount of NFTs minted
  const [amountMinted, setAmountMinted] = useState<number>(0);

  // Function to handle updating the amount of NFTs minted whenever a new NFT is minted
  const handleNewMint = async (_from: string, tokenId: BigNumber) => {
    console.log(tokenId.toNumber());
    setAmountMinted(tokenId.toNumber() + 1);
  };

  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum) {
      // Create provider to communicate with ethereum nodes
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      // Create connection to NFT contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
      // Create local state for the contract
      setConnectedContract(contract);
      // Get total nfts minted so far and set that value
      contract
        .getTotalNFTsMintedSoFar()
        .then((amount: BigNumber) => {
          setAmountMinted(amount.toNumber());
        })
        .catch((e: any) => {
          console.log(e);
        });
      // Set event listener for when a nft is minted to constantly keep updating the number of nfts minted
      contract.on("NewNFTMinted", handleNewMint);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
    return () => {
      if (connectedContract) {
        // Unsubscribe from event listener
        connectedContract.off("NewNFTMinted", handleNewMint);
      }
    };
  }, []);

  const askContractToMintNft = async () => {
    try {
      if (connectedContract) {
        console.log("Going to pop wallet now to pay gas...");
        // Begin mint
        let nftTxn = await connectedContract.mint();
        setMinting(true);

        // Wait for mint to finish
        await nftTxn.wait();
        setMinting(false);

        // We can return an opensea link to the NFT here or a link to the transaction on a blockchain explorer
        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ my: 4 }}>
        {!address || network !== "Mumbai Test Network" ? (
          <div>
            Make sure you have metamask installed and are connected to the
            Mumbai Test Net
          </div>
        ) : minting ? (
          <div>Minting...</div>
        ) : (
          <Button onClick={askContractToMintNft}>Mint NFT</Button>
        )}
      </Box>
      <Box sx={{ my: 4, color: ({ palette }) => palette.primary.main }}>
        <div>{amountMinted}/2 Minted</div>
      </Box>
    </>
  );
};
