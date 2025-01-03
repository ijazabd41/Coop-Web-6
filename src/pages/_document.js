import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  // const googleMapApikey = process.env.NEXT_PUBLIC_APP_MAP_API
  return (
    <Html lang="en">
      <Head />
      {/* <Script src={`https://maps.googleapis.com/maps/api/js?key=${googleMapApikey}&libraries=places`}
        async
        defer /> */}

      <body className="antialiased !pointer-events-auto">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
