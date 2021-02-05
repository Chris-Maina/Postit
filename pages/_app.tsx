import '../styles/globals.css';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SEO from '../next-seo.config';
import * as gtag from '../common/gtag';
import { AuthProvider } from '../helpers/authHelpers';
import CssBaseline from '@material-ui/core/CssBaseline';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Remove the server side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageView(url);
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events]);
  return (
    <>
      <Head>
        <title>Postit</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="google-site-verification" content="VgjM_h6e896v_XBbVIPOf0EznuwJKlDXWFnBIyKJgzI" />
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
