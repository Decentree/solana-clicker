import React from "react";
import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

type Props = unknown;

class Document extends NextDocument<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
