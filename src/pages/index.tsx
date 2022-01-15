import { ConnectButton } from "@/components";
import { Typography, Box, Button, Container, styled } from "@mui/material";
import { useAppSelector } from "src/redux/app/hooks";
import Link from "next/link";

const GetStartedButton = styled(Button)({
  textTransform: "none",
});

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
});

export default function Index() {
  const address = useAppSelector((state) => state.web3.data.address);
  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        {address ? (
          <Link href="/canvas" passHref>
            <GetStartedButton>Get Started</GetStartedButton>
          </Link>
        ) : (
          <ConnectButton />
        )}
      </Box>
    </PageContainer>
  );
}
