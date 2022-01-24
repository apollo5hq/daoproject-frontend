import { ConnectButton } from "@/components";
import { Typography, Box, Container, styled } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/redux/app/hooks";

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  justifyContent: "flex-start",
  marginTop: 300,
});

export default function Index() {
  const address = useAppSelector((state) => state.web3.data.address);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/canvas").catch((e) => console.log(e));
    if (!address) return;
    router.push("/canvas").catch((e) => console.log(e));
  }, [address]);

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
