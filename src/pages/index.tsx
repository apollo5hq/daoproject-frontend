import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { MintNFTButton } from "@/components";

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
        <MintNFTButton />
      </Box>
    </Container>
  );
}
