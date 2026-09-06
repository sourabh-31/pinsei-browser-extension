import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { faviconFor, initials } from "@/lib/bookmarkUtils";
import type { Bookmark } from "@/types/common.type";

interface BookmarkRowProps {
  bookmark: Bookmark;
  folderName?: string | null;
  onDelete: (bookmark: Bookmark) => void;
}

export function BookmarkRow({
  bookmark,
  folderName,
  onDelete,
}: BookmarkRowProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const meta = folderName
    ? `${bookmark.url}  ·  ${folderName}`
    : bookmark.url;

  const open = () => {
    browser.tabs.create({ url: "https://" + bookmark.url });
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className={cn(
        "group flex cursor-pointer items-center gap-2.5 rounded-xl px-1.5 py-1.5 hover:bg-surface-hover",
      )}
    >
      <div className="relative h-6.5 w-6.5 shrink-0">
        {!imgFailed ? (
          <img
            src={faviconFor(bookmark.url)}
            alt=""
            onError={() => setImgFailed(true)}
            className="h-6.5 w-6.5 rounded-lg object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent text-[9px] font-bold text-accent-foreground">
            {initials(bookmark.title)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          title={bookmark.title}
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-semibold leading-[1.35] text-foreground"
        >
          {bookmark.title}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold leading-[1.35] text-muted-foreground">
          {meta}
        </p>
      </div>

      <button
        type="button"
        aria-label="Delete bookmark"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(bookmark);
        }}
        className="flex shrink-0 rounded-full border-0 bg-transparent p-1.25 text-muted-foreground/70 opacity-0 outline-hidden transition-opacity group-hover:opacity-100 hover:text-destructive"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
