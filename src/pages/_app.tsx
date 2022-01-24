import { StrictMode } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider } from "react-redux";
import { theme } from "../styles/theme";
import { MenuAppBar, Snackbar } from "@/components";
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

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
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
            <MenuAppBar />
            <Component {...pageProps} />
            <Snackbar />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>
  );
}
