import { useEffect, useState } from "react";
import { Button, styled, Typography, Tooltip, Avatar } from "@mui/material";
import { useAppSelector, useAppDispatch } from "src/redux/app/hooks";
import {
  disconnectWallet,
  connectWallet,
  changeAccount,
  changeNetwork,
} from "src/redux/features/web3/webSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import copy from "copy-to-clipboard";

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const UserAvatar = styled(Avatar)({
  width: 45,
  height: 45,
});

const AuthButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  color: "black",
  backgroundColor: theme.palette.secondary.main,
  height: 35,
}));

const AddressWrapper = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 5,
  borderStyle: "solid",
  borderColor: theme.palette.background.default,
  borderWidth: 0,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
    cursor: "pointer",
  },
}));

const ConnectButton = () => {
  const dispatch = useAppDispatch();
  const {
    address: userAddress,
    ens,
    avatar,
    network,
  } = useAppSelector((state) => state.web3.data);
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

  // Use effect for hiding copy checkmark
  useEffect(() => {
    if (copied) {
      setInterval(() => setCopied(false), 500);
    }
  }, [copied]);

  // Sets a listener for when the user changes accounts or disconnects account from the app
  useEffect(() => {
    if ((window as any).ethereum) {
      // If wallet already connected to app just get data
      if ((window as any).ethereum.selectedAddress) {
        dispatch(connectWallet());
      }
      // Always set listeners
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      (window as any).ethereum.on("chainChanged", handleNetworkChanged);
      return () => {
        (window as any).ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        (window as any).ethereum.removeListener(
          "chainChanged",
          handleNetworkChanged
        );
      };
    }
  }, []);

  // If user not connected show connect button
  if (!userAddress) {
    return (
      <AuthButton
        data-testid="connectButton"
        onClick={() => dispatch(connectWallet())}
        variant="contained"
      >
        Connect
      </AuthButton>
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
      <div style={{ paddingLeft: 10, paddingRight: 10 }}>
        {ens && (
          <Typography
            sx={{ display: "flex", justifyContent: "center" }}
            variant="body2"
            data-testid="ens"
          >
            {ens}
          </Typography>
        )}
        <Tooltip title="Copy to clipboard" arrow>
          <AddressWrapper
            variant="body2"
            data-testid="address"
            onClick={handleCopyToClipboard}
          >
            {shortenAddress(userAddress)}
            {copied ? (
              <CheckIcon sx={{ fontSize: 13 }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: 13 }} />
            )}
          </AddressWrapper>
        </Tooltip>
        <Typography variant="body2" data-testid="network">
          {network}
        </Typography>
      </div>
      <AuthButton
        data-testid="disconnectButton"
        onClick={() => dispatch(disconnectWallet())}
        variant="contained"
        size="small"
      >
        Disconnect
      </AuthButton>
    </Container>
  );
};

export default ConnectButton;
