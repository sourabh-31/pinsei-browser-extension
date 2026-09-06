import { Input } from "@/components/ui/Input";
import { BookmarkRow } from "@/components/BookmarkRow";
import type { Bookmark } from "@/types/common.type";
import type { Tables } from "@/types/database.types";

interface RecentViewProps {
  bookmarks: Bookmark[];
  folders: Tables<"folders">[];
  query: string;
  onQueryChange: (q: string) => void;
  onDelete: (bookmark: Bookmark) => void;
}

export function RecentView({
  bookmarks,
  folders,
  query,
  onQueryChange,
  onDelete,
}: RecentViewProps) {
  const folderNameById = new Map(folders.map((f) => [f.id, f.name]));

  const RECENT_LIMIT = 10;

  const q = query.trim().toLowerCase();
  const shown = q
    ? bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q),
      )
    : bookmarks.slice(0, RECENT_LIMIT);

  return (
    <div className="flex flex-col gap-2">
      <Input
        isSearchIcon
        placeholder="Search all bookmarks"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <div className="flex flex-col gap-0.5">
        {shown.length === 0 ? (
          <p className="px-1.5 py-6 text-center text-[11.5px] font-semibold text-muted-foreground">
            {q ? `No matches for "${query}"` : "Nothing saved yet"}
          </p>
        ) : (
          shown.map((b) => (
            <BookmarkRow
              key={b.id}
              bookmark={b}
              folderName={b.folderId ? folderNameById.get(b.folderId) : null}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
