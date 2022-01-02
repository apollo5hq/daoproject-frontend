import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, CircularProgress } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { hasMetamask } from "src/redux/features/web3/webSlice";
import NFT from "../../../artifacts/contracts/ERC721.sol/NFT.json";

// Contract address to the ERC-721 or ERC-1155 token contract needed to create a connection to the contract
const CONTRACT_ADDRESS = "0xf0eB85fd9F9C858Cf94F6772c16D95a3582Cd3B4";

export default () => {
  const { isMetamask } = useAppSelector((state) => state.web3);
  const dispatch = useAppDispatch();
  // State for whether or not the user is minting
  const [minting, setMinting] = useState<boolean>(false);
  // State holding the connected ERC-721 or ERC-1155 token contract
  const [connectedContract, setConnectedContract] = useState<ethers.Contract>();
  // State for the amount of NFTs minted
  const [amountMinted, setAmountMinted] = useState<number>(0);
  // State for whether the user has claimed the NFT or not
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  // State for the loader
  const [loader, setLoader] = useState<boolean>(true);
  // State for the message when a user claims the NFT
  const [claimedMessage, setclaimedMessage] = useState<string>(
    "Congrats you have claimed your NFT :)"
  );

  // Function to handle updating the amount of NFTs minted whenever a new NFT is minted
  const handleNewMint = async (_from: string, tokenId: BigNumber) => {
    const id = tokenId.toNumber();
    setAmountMinted(id + 1);
    setclaimedMessage(
      `Congrats you have claimed your NFT :)\n\nIt can take up to 10 min to see your NFT on OpenSea! Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${id}`
    );
  };

  const connectContract = async () => {
    try {
      // Create provider to communicate with ethereum nodes
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [walletAddress] = await provider.listAccounts();
      const signer = provider.getSigner();
      // Create connection to NFT contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
      // Check if user has already claimed the NFT
      const balance = await contract.getBalance(walletAddress);
      // Get total nfts minted so far and set that value
      const amount = await contract.getTotalNFTsMintedSoFar();
      if (balance.toNumber() > 0) {
        setHasClaimed(!hasClaimed);
        return;
      }
      // Create local state for the contract
      setConnectedContract(contract);
      setAmountMinted(amount.toNumber());
      // Set event listener for when a nft is minted to constantly keep updating the number of nfts minted
      contract.on("NewNFTMinted", handleNewMint);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      // User has metamask installed
      dispatch(hasMetamask());
      // Connect connection to NFT contract
      connectContract().then(() => setLoader(false));
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
        setHasClaimed(!hasClaimed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Return loader first
  if (loader) {
    return <CircularProgress />;
  }

  // Check if metamask is installed
  if (!isMetamask) {
    return <div>Make sure you have metamask installed</div>;
  }

  // Check if user has claimed NFT
  if (hasClaimed) {
    return <div>{claimedMessage}</div>;
  }

  return (
    <>
      <Box sx={{ my: 4 }}>
        {minting ? (
          <div>Minting...</div>
        ) : (
          <>
            <Button onClick={askContractToMintNft}>Mint NFT</Button>
            <Box sx={{ my: 4, color: ({ palette }) => palette.primary.main }}>
              <div>{amountMinted}/2 Minted</div>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
