import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ConnectButton from "../components/ConnectButton";

export default function Index() {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      maxWidth="sm"
    >
      <Box sx={{ my: 4 }}>
        <ConnectButton />
      </Box>
    </Container>
  );
}
