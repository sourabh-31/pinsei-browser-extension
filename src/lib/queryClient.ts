import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Persister } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const PERSIST_KEY = "pinsei-query-cache";

/**
 * Popup documents are torn down every time the popup closes, so the in-memory
 * query cache would otherwise be rebuilt from scratch (and refetch over the
 * network) on every open. Persisting it to browser.storage.local — the same
 * durable store used for the Supabase session, see lib/supabase.ts — lets the
 * popup render cached bookmarks instantly while revalidating in the background.
 */
const storage = {
  async getItem(key: string) {
    const result = await browser.storage.local.get(key);
    return (result[key] as string | undefined) ?? null;
  },
  async setItem(key: string, value: string) {
    await browser.storage.local.set({ [key]: value });
  },
  async removeItem(key: string) {
    await browser.storage.local.remove(key);
  },
};

export const queryPersister: Persister = createAsyncStoragePersister({
  storage,
  key: PERSIST_KEY,
});
