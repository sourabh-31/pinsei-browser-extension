import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Popup documents are torn down every time the popup closes, so Supabase's
 * default localStorage-based session storage can't be trusted to survive
 * between opens in all cases. browser.storage.local is the extension's
 * durable, cross-context store, so we adapt it to the shape supabase-js
 * expects from a custom `storage` implementation.
 */
const extensionStorage = {
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

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: extensionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
