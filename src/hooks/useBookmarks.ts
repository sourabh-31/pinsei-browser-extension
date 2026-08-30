import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookmarks,
  saveBookmark,
  updateBookmarks,
} from "@/lib/api";
import { useSession } from "@/hooks/sessionContext";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

export function bookmarksQueryKey(userId: string | undefined) {
  return ["bookmarks", userId] as const;
}

export function useBookmarks() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: bookmarksQueryKey(userId),
    queryFn: () => fetchBookmarks(userId!),
    enabled: !!userId,
  });
}

type NewBookmark = Omit<TablesInsert<"bookmarks">, "user_id">;

export function useAddBookmark() {
  const { session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmark: NewBookmark) => {
      if (!userId) throw new Error("You must be signed in to add a bookmark");
      return saveBookmark({ ...bookmark, user_id: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksQueryKey(userId) });
    },
  });
}

/** Soft-deletes a bookmark, matching the web app's Bin behavior — it stays recoverable there. */
export function useDeleteBookmark() {
  const { session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateBookmarks([id], { deleted_at: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksQueryKey(userId) });
    },
  });
}

export function useRestoreBookmark() {
  const { session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateBookmarks([id], { deleted_at: null, deleted_from_folder_id: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksQueryKey(userId) });
    },
  });
}

export function useUpdateBookmark() {
  const { session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: TablesUpdate<"bookmarks">;
    }) => updateBookmarks([id], updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksQueryKey(userId) });
    },
  });
}
