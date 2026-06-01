import { useEffect, useState, Suspense } from "react";
import "@/styles/globals.css";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import SessionBootstrap from "@/components/SessionBootstrap";

import { QueryClientProvider } from "@tanstack/react-query";
import { createAppQueryClient } from "@/lib/queryClient";

import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-family',
  display: 'swap',
});

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['300','400','500','600','700','800','900'],
//   variable: '--font-heading',
//   display: 'swap',
// });

const queryClient = createAppQueryClient();

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const selectedLanguage = useSelector(
    (state) => state.Language.selectedLanguage
  );

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <Loader screen="full" />}
      <Component {...pageProps} />
    </>
  );
}

export default function App({ Component, pageProps }) {

  return (
    <main className={`${nunito.variable} `}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <SessionBootstrap />
            <ThemeProvider attribute="class" defaultTheme="light">
              <Suspense fallback={<Loader screen="full" />}>
                <AppContent Component={Component} pageProps={pageProps} />
              </Suspense>
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </main>
  );
}
