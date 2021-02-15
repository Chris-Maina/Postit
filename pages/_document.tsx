import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles'

import { GA_TRACKING_ID } from '../common/gtag';

const isProduction = process.env.NODE_ENV === "production";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* enable analytics script only for production */}
          {isProduction && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname
                    });
                  `
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// Handle the initial render when a user(or search engine crawler) first requests your app
// NOTE: When the server receives the request, it renders the required component(s) into an HTML string,
// and then sends it as a response to the client. From that point on, the client takes over rendering duties.
MyDocument.getInitialProps = async (ctx): Promise<any> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  // wrap App inside a StylesProvider (and ThemeProvider) to make the style configuration (and the theme) available to all components in the component tree.
  ctx.renderPage = () => 
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });
  
  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]
  }
}

export default MyDocument;
