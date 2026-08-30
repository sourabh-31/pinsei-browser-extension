import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAddBookmark } from "@/hooks/useBookmarks";
import {
  cleanUrl,
  faviconFor,
  initials,
  normalizeUrl,
  stripNotificationCount,
  titleFromUrl,
} from "@/lib/bookmarkUtils";
import type { Bookmark } from "@/types/common.type";
import type { Tables } from "@/types/database.types";

interface SaveTabCardProps {
  bookmarks: Bookmark[];
  folders: Tables<"folders">[];
}

interface TabInfo {
  title: string;
  url: string;
  favIconUrl?: string;
}

export function SaveTabCard({ bookmarks, folders }: SaveTabCardProps) {
  const [tab, setTab] = useState<TabInfo | null | undefined>(undefined);
  const [folderId, setFolderId] = useState("");
  const [imgFailed, setImgFailed] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const addBookmark = useAddBookmark();

  useEffect(() => {
    let cancelled = false;
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(([current]) => {
        if (cancelled) return;
        if (!current?.url || !/^https?:\/\//.test(current.url)) {
          setTab(null);
          return;
        }
        setTab({
          title: current.title ?? "",
          url: current.url,
          favIconUrl: current.favIconUrl,
        });
      })
      .catch(() => !cancelled && setTab(null));
    return () => {
      cancelled = true;
    };
  }, []);

  if (tab === undefined) {
    return <div className="mx-3 mt-1 h-19 shrink-0 animate-pulse rounded-2xl bg-card/70" />;
  }

  if (tab === null) {
    return (
      <div className="mx-3 mt-1 flex shrink-0 items-center gap-2.5 rounded-2xl bg-card p-3 text-[11.5px] font-medium text-muted-foreground shadow-field">
        This page can&apos;t be saved.
      </div>
    );
  }

  const clean = cleanUrl(tab.url);
  const key = normalizeUrl(clean);
  const existing = bookmarks.find((b) => normalizeUrl(b.url) === key);
  const existingFolder = existing?.folderId
    ? (folders.find((f) => f.id === existing.folderId)?.name ?? null)
    : null;
  const saved = !!existing || justSaved;
  const title = stripNotificationCount(tab.title.trim()) || titleFromUrl(clean);

  const save = () => {
    addBookmark.mutate(
      { title, url: clean, folder_id: folderId || null },
      {
        onSuccess: () => {
          setJustSaved(true);
        },
      },
    );
  };

  return (
    <div className="mx-3 mt-1 flex shrink-0 flex-col gap-2.5 rounded-2xl bg-card p-3 shadow-field">
      <div className="flex items-center gap-2.5">
        <div className="relative h-7 w-7 shrink-0">
          {!imgFailed && (tab.favIconUrl || clean) ? (
            <img
              src={tab.favIconUrl || faviconFor(clean)}
              alt=""
              onError={() => setImgFailed(true)}
              className="h-7 w-7 rounded-lg object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent text-[10px] font-bold text-accent-foreground">
              {initials(title)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-medium leading-[1.3] text-foreground">
            {title}
          </p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold leading-[1.3] text-muted-foreground">
            {clean}
          </p>
        </div>
      </div>

      {saved ? (
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent px-2.5 py-1.75 text-[11.5px] font-semibold text-accent-foreground">
          <Check size={13} strokeWidth={3} />
          {existingFolder
            ? `Saved in ${existingFolder}`
            : justSaved && folderId
              ? "Saved"
              : "Saved in Unsorted"}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="h-8 min-w-0 flex-1 rounded-[10px] border border-border bg-card px-2 text-[12px] font-medium text-foreground-secondary shadow-field outline-none hover:border-[oklch(0.9_0.004_300)]"
          >
            <option value="">Unsorted</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={save}
            disabled={addBookmark.isPending}
            className="shrink-0"
          >
            <Plus size={13} />
            {addBookmark.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
