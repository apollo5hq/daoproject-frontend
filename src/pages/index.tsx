import { ConnectButton } from "@/components";
import { styled, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 300,
});

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        {isMobile ? (
          <Link href="/canvas">
            <Button variant="contained" color="secondary">
              Check out canvas!
            </Button>
          </Link>
        ) : (
          <ConnectButton />
        )}
      </Box>
    </PageContainer>
  );
}
