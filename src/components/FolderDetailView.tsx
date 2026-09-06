import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { BookmarkRow } from "@/components/BookmarkRow";
import { UNSORTED, FAVOURITES, type Bookmark } from "@/types/common.type";

interface FolderDetailViewProps {
  folderId: string;
  folderName: string;
  bookmarks: Bookmark[];
  query: string;
  onQueryChange: (q: string) => void;
  onBack: () => void;
  onDelete: (bookmark: Bookmark) => void;
}

export function FolderDetailView({
  folderId,
  folderName,
  bookmarks,
  query,
  onQueryChange,
  onBack,
  onDelete,
}: FolderDetailViewProps) {
  const scoped = bookmarks.filter((b) => {
    if (folderId === UNSORTED) return !b.folderId;
    if (folderId === FAVOURITES) return b.favourite;
    return b.folderId === folderId;
  });

  const q = query.trim().toLowerCase();
  const shown = q
    ? scoped.filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q),
      )
    : scoped;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to folders"
          className="flex shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-1 text-muted-foreground outline-hidden hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={15} />
        </button>
        <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-foreground-secondary">
          {folderName}
        </h2>
        <span className="ml-auto shrink-0 text-[10.5px] font-bold text-muted-foreground">
          {scoped.length} {scoped.length === 1 ? "bookmark" : "bookmarks"}
        </span>
      </div>

      <Input
        isSearchIcon
        placeholder="Search in this folder"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <div className="flex flex-col gap-0.5">
        {shown.length === 0 ? (
          <p className="px-1.5 py-6 text-center text-[11.5px] font-semibold text-muted-foreground">
            {q ? `No matches for "${query}"` : "Nothing here yet"}
          </p>
        ) : (
          shown.map((b) => (
            <BookmarkRow key={b.id} bookmark={b} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
