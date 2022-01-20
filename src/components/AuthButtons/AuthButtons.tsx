import { useEffect, useState } from "react";
import { Button, styled, Typography, Tooltip, Avatar } from "@mui/material";
import { useAppSelector, useAppDispatch } from "src/redux/app/hooks";
import {
  disconnectWallet as disconnectMessage,
  connectWallet,
  changeAccount,
  changeNetwork,
} from "src/redux/features/web3/webSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import copy from "copy-to-clipboard";
import {
  walletConnected,
  walletDisconnected,
} from "src/redux/features/snackbar/snackbarSlice";
import { ChainId } from "src/utils/network";

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

export const ConnectButton = () => {
  const dispatch = useAppDispatch();
  return (
    <AuthButton
      data-testid="connectButton"
      onClick={() => dispatch(connectWallet())}
      variant="contained"
    >
      Connect
    </AuthButton>
  );
};

export default function () {
  const dispatch = useAppDispatch();
  // State of the user's web3 instance
  const {
    data: { address: userAddress, ens, avatar, network },
  } = useAppSelector((state) => state.web3);
  // State for whether or not the user's address is copied
  const [copied, setCopied] = useState<boolean>(false);
  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This function runs when the user disconnects the account from the app in metamask.
  const handleAccountsChanged = (addresses: string[]) => {
    let address: string | null = null;
    if (addresses.length > 0) {
      address = addresses[0];
    }
    dispatch(changeAccount({ address }));
  };

  // This runs when the user switch networks in metamask
  const handleNetworkChanged = (chainId: ChainId) => {
    console.log(chainId);
    dispatch(changeNetwork({ chainId }));
  };

  const handleCopyToClipboard = () => {
    if (userAddress) {
      copy(userAddress);
      setCopied(true);
    }
  };

  // Disconnect wallet and show snackbar message
  const disconnectWallet = () => {
    // Dispatch web3 action
    dispatch(walletDisconnected());
    // Dispatch snackbar action
    dispatch(disconnectMessage());
  };

  // Use effect for hiding copy checkmark
  useEffect(() => {
    if (copied) {
      setInterval(() => setCopied(false), 500);
    }
  }, [copied]);

  // Sets a listener for when the user changes accounts or disconnects account from the app
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      // Set listeners for when a user changes network or metamask account
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleNetworkChanged);
    }
    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleNetworkChanged);
      }
    };
  }, []);

  // If user not connected show connect button
  if (!userAddress) {
    return <ConnectButton />;
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
        onClick={disconnectWallet}
        variant="contained"
        size="small"
      >
        Disconnect
      </AuthButton>
    </Container>
  );
}
