import { Typography, Box, Container, styled } from "@mui/material";
import { ConnectButton } from "@/components";

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 300,
});

export default function Index() {
  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <ConnectButton />
      </Box>
    </PageContainer>
  );
}
