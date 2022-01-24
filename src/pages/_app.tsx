import { StrictMode } from "react";
import { AppProps } from "next/app";
import { ThemeProvider, styled } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider } from "react-redux";
import { theme } from "../styles/theme";
import { MenuAppBar, Snackbar } from "@/components";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "../utils/createEmotionCache";
import store from "../redux/app/store";
import Head from "next/head";

// Globally assign the ethereum typing in the window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MobileMessageWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.secondary.main,
  height: 64,
  justifyContent: "center",
  padding: 30,
  width: "100%",
  position: "fixed",
});

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <StrictMode>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>DAO</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {isMobile ? (
              <div style={{ paddingBottom: 65 }}>
                <MobileMessageWrapper>
                  <Typography fontSize={15} color="black" align="center">
                    Use DAOProject on a desktop to connect your wallet and
                    create NFTs
                  </Typography>
                </MobileMessageWrapper>
              </div>
            ) : (
              <MenuAppBar />
            )}
            <Component {...pageProps} />
            <Snackbar />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>
  );
}
