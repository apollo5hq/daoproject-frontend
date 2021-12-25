import { useEffect } from "react";
import { Button, styled } from "@mui/material";
import { getAccounts, selectNetwork, supportedChains } from "../utils/network";
import Avatar from "@mui/material/Avatar";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import {
  disconnectWallet,
  connectWallet,
  changeAccount,
  changeNetwork,
} from "../redux/features/web3/webSlice";

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
  const dispatch = useAppDispatch();
  const {
    data: { address: userAddress, ens, avatar, chainId, network },
    error,
  } = useAppSelector((state) => state.web3);
  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This function runs when the user disconnects the account from the app in metamask.
  const handleAccountsChanged = () => {
    dispatch(changeAccount());
  };

  // This runs when the user switch networks in metamask
  const handleNetworkChanged = (chainId: string) => {
    dispatch(changeNetwork(chainId));
  };

  // Sets a listener for when the user changes accounts or disconnects account from the app
  useEffect(() => {
    if (window.ethereum) {
      // If wallet already connected to app just get data
      if (window.ethereum.selectedAddress) {
        const network = selectNetwork(window.ethereum.chainId);
        getAccounts()
          .then((data) => {
            dispatch({ type: "web3/connect", payload: { ...data, network } });
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

  // Error message is shown if user gets error connecting to metamask
  if (error) {
    <div data-testid="noMetamask">
      Make sure you have metamask installed in your browser
    </div>;
  }

  // If user not connected show connect button
  if (!userAddress) {
    return (
      <AuthButton
        data-testid="connectButton"
        onClick={() => dispatch(connectWallet())}
        variant="outlined"
      >
        Connect
      </AuthButton>
    );
  }

  // If user's metamask is on an unsupported chain show message
  if (!supportedChains.includes(chainId)) {
    return (
      <div data-testid="wrongChain">
        Unsupported network. Switch your network to either Ethereum Mainnet,
        Ropsten, Rinkeby, Goerli, Kovan, Polygon Mainnet or Mumabi Test Net
      </div>
    );
  }

  return (
    <Container>
      <div style={{ padding: 5 }}>
        <UserAvatar
          data-testid="avatar"
          alt="userAvatar"
          src={avatar ? avatar : ""}
        />
      </div>
      <div>
        {ens && <div data-testid="ens">{ens}</div>}
        <div data-testid="address">{shortenAddress(userAddress)}</div>
        <div data-testid="network">{network}</div>
        <AuthButton
          data-testid="disconnectButton"
          onClick={() => dispatch(disconnectWallet())}
          variant="outlined"
        >
          Disconnect
        </AuthButton>
      </div>
    </Container>
  );
};
