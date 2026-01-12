import { useEffect, useState, Suspense } from "react";
import "@/styles/globals.css";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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

  useEffect(() => {
    if (!selectedLanguage?.code) return;

    const currentLang = router.query.lang;

    // Prevent infinite loop
    if (currentLang === selectedLanguage.code) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          lang: selectedLanguage.code,
        },
      },
      undefined
    );
  }, [selectedLanguage?.code, router]);

  return (
    <>
      {loading && <Loader screen="full" />}
      <Component {...pageProps} />
    </>
  );
}

export default function App({ Component, pageProps }) {

  return (
    <main>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
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
