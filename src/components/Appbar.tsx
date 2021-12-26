import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ConnectButton from "../components/ConnectButton";

export default function MenuAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Company Name
          </Typography>
          <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
