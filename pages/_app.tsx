import "../styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>TicTac</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="import" href="component.html" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />{" "}
      </Head>{" "}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
