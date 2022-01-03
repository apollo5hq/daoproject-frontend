import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { AuthButtons } from "@/components";

export default function MenuAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" data-testid="menu-app-bar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Company Name
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
