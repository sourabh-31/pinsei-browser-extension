import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { dbRowToBookmark } from "@/lib/bookmarkUtils";
import { Header } from "@/components/Header";
import { SaveTabCard } from "@/components/SaveTabCard";
import { FoldersView } from "@/components/FoldersView";
import { FolderDetailView } from "@/components/FolderDetailView";
import { RecentView } from "@/components/RecentView";
import { UndoBanner } from "@/components/UndoBanner";
import {
  useBookmarks,
  useDeleteBookmark,
  useRestoreBookmark,
} from "@/hooks/useBookmarks";
import { useFolders } from "@/hooks/useFolders";
import type { Bookmark } from "@/types/common.type";

type View =
  | { kind: "recent" }
  | { kind: "folders" }
  | { kind: "folder"; id: string; name: string };

const UNDO_TIMEOUT_MS = 4000;

export function PopupShell() {
  const [view, setView] = useState<View>({ kind: "recent" });
  const [recentQuery, setRecentQuery] = useState("");
  const [foldersQuery, setFoldersQuery] = useState("");
  const [detailQuery, setDetailQuery] = useState("");
  const [undo, setUndo] = useState<{ id: string; title: string } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: bookmarkRows, isLoading: bookmarksLoading } = useBookmarks();
  const { data: folderRows, isLoading: foldersLoading } = useFolders();
  const deleteBookmark = useDeleteBookmark();
  const restoreBookmark = useRestoreBookmark();

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, []);

  const bookmarks = (bookmarkRows ?? []).map(dbRowToBookmark);
  const folders = folderRows ?? [];
  const loading = bookmarksLoading || foldersLoading;

  function handleDelete(bookmark: Bookmark) {
    deleteBookmark.mutate(bookmark.id);
    setUndo({ id: bookmark.id, title: bookmark.title });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), UNDO_TIMEOUT_MS);
  }

  function handleUndo() {
    if (!undo) return;
    restoreBookmark.mutate(undo.id);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo(null);
  }

  function openFolder(id: string, name: string) {
    setDetailQuery("");
    setView({ kind: "folder", id, name });
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-app-shell">
      <Header />
      <SaveTabCard bookmarks={bookmarks} folders={folders} />

      <div className="mx-3 mt-3 flex shrink-0 gap-0.75 rounded-[11px] bg-muted p-0.75">
        <TabButton
          active={view.kind === "recent"}
          onClick={() => setView({ kind: "recent" })}
        >
          Recent
        </TabButton>
        <TabButton
          active={view.kind !== "recent"}
          onClick={() => setView({ kind: "folders" })}
        >
          Folders
        </TabButton>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2.5">
        {loading ? (
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9.5 rounded-xl bg-card/70 animate-pulse" />
            ))}
          </div>
        ) : view.kind === "recent" ? (
          <RecentView
            bookmarks={bookmarks}
            folders={folders}
            query={recentQuery}
            onQueryChange={setRecentQuery}
            onDelete={handleDelete}
          />
        ) : view.kind === "folders" ? (
          <FoldersView
            folders={folders}
            bookmarks={bookmarks}
            query={foldersQuery}
            onQueryChange={setFoldersQuery}
            onOpen={openFolder}
          />
        ) : (
          <FolderDetailView
            folderId={view.id}
            folderName={view.name}
            bookmarks={bookmarks}
            query={detailQuery}
            onQueryChange={setDetailQuery}
            onBack={() => setView({ kind: "folders" })}
            onDelete={handleDelete}
          />
        )}
      </div>

      {undo && <UndoBanner title={undo.title} onUndo={handleUndo} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 cursor-pointer rounded-[9px] border-0 py-1.5 text-[11.5px] font-bold outline-hidden",
        active
          ? "bg-card text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.45)]"
          : "bg-transparent text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
