import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query defaults — fewer refetches, stable cached shop/settings data.
 */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
