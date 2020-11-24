import '../styles/globals.css';
import Head from "next/head";
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from '../helpers/authHelpers';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });
  return (
    <>
      <Head>
        <title>Postit</title>
      </Head>
      <AuthProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
