import { ConnectButton } from "@rainbow-me/rainbowkit";
import { styled, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 300,
});

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data } = useAccount();

  useEffect(() => {
    if (data) {
      router.push("/canvas").catch((e) => console.log(e));
    }
  }, [data]);
  console.log(data);
  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {isMobile ? (
          <Link href="/canvas">
            <Button variant="contained">Check out the canvas!</Button>
          </Link>
        ) : (
          <ConnectButton />
        )}
      </Box>
    </PageContainer>
  );
}
