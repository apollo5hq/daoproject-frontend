import { useEffect, useState } from "react";
import { Button, styled, Typography, Tooltip } from "@mui/material";
import { getAccounts, selectNetwork, supportedChains } from "../utils/network";
import Avatar from "@mui/material/Avatar";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import {
  disconnectWallet,
  connectWallet,
  changeAccount,
  changeNetwork,
} from "../redux/features/web3/webSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import copy from "copy-to-clipboard";

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

const AddressWrapper = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 5,
  borderStyle: "solid",
  borderColor: theme.palette.background.default,
  borderWidth: 0,
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
    cursor: "pointer",
  },
}));

export default () => {
  const dispatch = useAppDispatch();
  const {
    data: { address: userAddress, ens, avatar, chainId, network },
    error,
  } = useAppSelector((state) => state.web3);
  const [copied, setCopied] = useState<boolean>(false);
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

  const handleCopyToClipboard = () => {
    if (userAddress) {
      copy(userAddress);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      setInterval(() => setCopied(false), 250);
    }
  }, [copied]);

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
      <div style={{ paddingLeft: 10 }}>
        {ens && <Typography data-testid="ens">{ens}</Typography>}
        <Tooltip title="Copy to clipboard" arrow>
          <AddressWrapper data-testid="address" onClick={handleCopyToClipboard}>
            {shortenAddress(userAddress)}
            {copied ? (
              <CheckIcon sx={{ fontSize: 15 }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: 15 }} />
            )}
          </AddressWrapper>
        </Tooltip>
        <Typography data-testid="network">{network}</Typography>
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
