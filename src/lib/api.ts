import { supabase } from "@/lib/supabase";
import { normalizeUrl } from "@/lib/bookmarkUtils";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchBookmarks(
  userId: string,
): Promise<Tables<"bookmarks">[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addBookmark(
  bookmark: TablesInsert<"bookmarks">,
): Promise<Tables<"bookmarks">> {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert(bookmark)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Saves a bookmark, but if the same URL already exists in the user's bin
 * (soft-deleted), restores that row into the chosen folder instead of
 * inserting a duplicate — the deleted copy is invisible to the extension's
 * views, so from the popup this just looks like a normal save.
 */
export async function saveBookmark(
  bookmark: TablesInsert<"bookmarks">,
): Promise<Tables<"bookmarks">> {
  const { data: binned, error: binError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", bookmark.user_id)
    .not("deleted_at", "is", null);

  if (binError) throw binError;

  const key = normalizeUrl(bookmark.url);
  const match = binned.find((b) => normalizeUrl(b.url) === key);
  if (!match) return addBookmark(bookmark);

  const { data, error } = await supabase
    .from("bookmarks")
    .update({
      title: bookmark.title,
      folder_id: bookmark.folder_id ?? null,
      deleted_at: null,
      deleted_from_folder_id: null,
    })
    .eq("id", match.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookmarks(
  ids: string[],
  updates: TablesUpdate<"bookmarks">,
): Promise<Tables<"bookmarks">[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .update(updates)
    .in("id", ids)
    .select();

  if (error) throw error;
  return data;
}

export async function fetchFolders(
  userId: string,
): Promise<Tables<"folders">[]> {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
