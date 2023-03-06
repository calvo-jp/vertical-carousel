import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oxygen&display=swap"
        />
      </Head>

      <body className="min-h-screen font-sans bg-white text-neutral-900 p-4">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
