import { ConnectButton } from "@/components";
import { Typography, Box, Button, Container, styled } from "@mui/material";
import { useAppSelector } from "src/redux/app/hooks";

const GetStartedButton = styled(Button)({
  textTransform: "none",
});

export default function Index() {
  const address = useAppSelector((state) => state.web3.data.address);
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      maxWidth="lg"
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        {address ? (
          <GetStartedButton>Get Started</GetStartedButton>
        ) : (
          <ConnectButton />
        )}
      </Box>
    </Container>
  );
}
