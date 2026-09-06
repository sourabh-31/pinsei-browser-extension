import type { ReactNode } from "react";
import { Folder, Heart, Inbox } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { tintClass } from "@/lib/bookmarkUtils";
import { UNSORTED, FAVOURITES, type Bookmark } from "@/types/common.type";
import type { Tables } from "@/types/database.types";

interface FoldersViewProps {
  folders: Tables<"folders">[];
  bookmarks: Bookmark[];
  query: string;
  onQueryChange: (q: string) => void;
  onOpen: (id: string, name: string) => void;
}

export function FoldersView({
  folders,
  bookmarks,
  query,
  onQueryChange,
  onOpen,
}: FoldersViewProps) {
  const unsortedCount = bookmarks.filter((b) => !b.folderId).length;
  const favouritesCount = bookmarks.filter((b) => b.favourite).length;

  const q = query.trim().toLowerCase();
  const customFolders = folders.filter((f) =>
    q ? f.name.toLowerCase().includes(q) : true,
  );
  const showUnsorted = !q || "unsorted".includes(q);
  const showFavourites = !q || "favourites".includes(q);

  return (
    <div className="flex flex-col gap-2">
      <Input
        isSearchIcon
        placeholder="Search folders"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <div className="flex flex-col gap-1">
        {showUnsorted && (
          <FolderRow
            icon={<Inbox size={14} />}
            iconClassName="bg-muted text-muted-foreground"
            name="Unsorted"
            count={unsortedCount}
            onClick={() => onOpen(UNSORTED, "Unsorted")}
          />
        )}
        {showFavourites && (
          <FolderRow
            icon={<Heart size={14} />}
            iconClassName="bg-accent text-accent-foreground"
            name="Favourites"
            count={favouritesCount}
            onClick={() => onOpen(FAVOURITES, "Favourites")}
          />
        )}
        {customFolders.map((f) => (
          <FolderRow
            key={f.id}
            icon={<Folder size={14} />}
            iconClassName={tintClass(f.tint)}
            name={f.name}
            count={bookmarks.filter((b) => b.folderId === f.id).length}
            onClick={() => onOpen(f.id, f.name)}
          />
        ))}

        {!showUnsorted && !showFavourites && customFolders.length === 0 && (
          <p className="px-1.5 py-6 text-center text-[11.5px] font-semibold text-muted-foreground">
            No folders match &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

function FolderRow({
  icon,
  iconClassName,
  name,
  count,
  onClick,
}: {
  icon: ReactNode;
  iconClassName: string;
  name: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2.5 rounded-xl border-0 bg-card px-2.5 py-2 text-left shadow-card outline-hidden hover:bg-surface-hover"
    >
      <span
        className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[9px] ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-semibold text-foreground-secondary">
        {name}
      </span>
      <span className="shrink-0 text-[10.5px] font-bold text-muted-foreground">
        {count}
      </span>
    </button>
  );
}
