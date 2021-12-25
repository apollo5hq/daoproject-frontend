import { useState, useEffect } from "react";
import { Button, styled } from "@mui/material";
import { getAccounts, selectNetwork, supportedChains } from "../utils/network";
import Avatar from "@mui/material/Avatar";

interface WalletState {
  address: string | null;
  ens: string | null;
  avatar: string | null;
  chainId: string;
  network: string;
}

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
});

const UserAvatar = styled(Avatar)({
  width: 65,
  height: 65,
});

const AuthButton = styled(Button)({
  textTransform: "none",
});

export default () => {
  const defaultState: WalletState = {
    address: null,
    ens: null,
    avatar: null,
    chainId: "",
    network: "",
  };
  // State of connected wallet and data associated with it
  const [{ address: userAddress, ens, avatar, chainId, network }, setWallet] =
    useState<WalletState>(defaultState);
  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Function to connect user wallet. Only supports metamask for now
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("please install MetaMask");
      return;
    }
    try {
      // App asks user for permission to view metamask accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const network = selectNetwork(window.ethereum.chainId);
      const accountData = await getAccounts();
      setWallet({ ...accountData, network });
    } catch (error) {
      console.log(error);
    }
  };

  // This function runs when the user disconnects the account from the app in metamask.
  const handleAccountsChanged = async () => {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
      return setWallet(defaultState);
    }
    try {
      const accountData = await getAccounts();
      setWallet(({ network }) => {
        return { ...accountData, network };
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleNetworkChanged = async (chainId: string) => {
    try {
      const network = selectNetwork(chainId);
      const accountData = await getAccounts();
      setWallet({ ...accountData, chainId, network });
    } catch (e) {
      console.log(e);
    }
  };
  const disconnectWallet = () => setWallet(defaultState);

  // Sets a listener for when the user changes accounts or disconnects account from the app
  useEffect(() => {
    if (window.ethereum) {
      // If wallet already connected to app just get data
      if (window.ethereum.selectedAddress) {
        const network = selectNetwork(window.ethereum.chainId);
        getAccounts()
          .then((data) => {
            setWallet({ ...data, network });
          })
          .catch((e) => {
            console.log(e);
          });
      }
      // Always set listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleNetworkChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleNetworkChanged);
      };
    }
  }, []);

  // If user not connected show connect button
  if (!userAddress) {
    return (
      <AuthButton onClick={connectWallet} variant="outlined">
        Connect
      </AuthButton>
    );
  }

  // If user's metamask is on an unsupported chain show message
  if (!supportedChains.includes(chainId)) {
    return (
      <div>
        Unsupported network. Switch your network to either Ethereum Mainnet,
        Ropsten, Rinkeby, Goerli, Kovan, Polygon Mainnet or Mumabi Test Net
      </div>
    );
  }

  return (
    <Container>
      <div style={{ padding: 5 }}>
        <UserAvatar alt="userAvatar" src={avatar ? avatar : ""} />
      </div>
      <div>
        {ens && <div>{ens}</div>}
        <div>{shortenAddress(userAddress)}</div>
        <div>{network}</div>
        <AuthButton onClick={disconnectWallet} variant="outlined">
          Disconnect
        </AuthButton>
      </div>
    </Container>
  );
};
