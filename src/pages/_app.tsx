import { StrictMode } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider } from "react-redux";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import MenuAppBar from "../components/Appbar";
import store from "../redux/app/store";

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
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>
  );
}
