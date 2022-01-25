import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { AuthButtons } from "@/components";
import { useAppSelector } from "src/redux/app/hooks";
import dynamic from "next/dynamic";

const ConnectButton = dynamic(() => import("../AuthButtons/ConnectButton"));

export default function MenuAppBar() {
  const { address: userAddress } = useAppSelector((state) => state.web3.data);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" data-testid="menu-app-bar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          {userAddress ? <AuthButtons /> : <ConnectButton />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
