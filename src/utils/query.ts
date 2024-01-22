import { QueryClient } from '@tanstack/react-query';

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount) {
        if (failureCount < 2) return true;
        return false;
      },
    },
  },
});
