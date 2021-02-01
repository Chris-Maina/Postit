import '../styles/globals.css';
import React, { useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from '../helpers/authHelpers';
import SEO from '../next-seo.config';

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
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </Head>
      <AuthProvider>
        <CssBaseline />
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
