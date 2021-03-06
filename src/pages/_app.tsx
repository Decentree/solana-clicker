import React from "react";
import { AppProps } from "next/app";

import Head from "next/head";
import Providers from "../components/Providers";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <title>Solana Clicker</title>
        <meta name="theme-color" content="#fff" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={""} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@600;800&family=Permanent+Marker&family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
};

export default App;
