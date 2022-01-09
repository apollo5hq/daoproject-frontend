import { Typography, Box, Button, Container, styled } from "@mui/material";

const GetStartedButton = styled(Button)({
  textTransform: "none",
});

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
      maxWidth="lg"
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <GetStartedButton>Get Started</GetStartedButton>
      </Box>
    </Container>
  );
}
