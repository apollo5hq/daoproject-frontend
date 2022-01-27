import { ConnectButton } from "@/components";
import { styled, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useAppSelector } from "src/redux/app/hooks";
import { useRouter } from "next/router";

const PageContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 300,
});

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const address = useAppSelector((state) => state.web3.data.address);
  const router = useRouter();

  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2">Welcome to DAO Project</Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        {address ? (
          <>
            <div style={{ padding: 5 }}>
              <Button
                onClick={() =>
                  router.push("/canvas").catch((e) => console.log(e))
                }
                variant="contained"
              >
                Enter canvas playground
              </Button>
            </div>
            <div style={{ padding: 5 }}>
              <Button
                onClick={() =>
                  router.push("/mural").catch((e) => console.log(e))
                }
                variant="contained"
              >
                Enter mural playground
              </Button>
            </div>
          </>
        ) : (
          <ConnectButton />
        )}
      </Box>
    </PageContainer>
  );
}
