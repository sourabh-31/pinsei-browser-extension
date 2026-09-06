import { useEffect, useRef, useState } from "react";
import { ExternalLink, LogOut, RefreshCw } from "lucide-react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/sessionContext";
import { useSignOut } from "@/hooks/useAuth";
import { initials } from "@/lib/bookmarkUtils";
import { Logo } from "@/components/Logo";

export function Header() {
  const { session } = useSession();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching() > 0;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const user = session?.user;
  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : undefined;
  const displayName = fullName || user?.email || "Account";
  const avatarLabel = initials(displayName) || "P";

  return (
    <header className="flex shrink-0 items-center gap-2 px-3.5 pt-3 pb-2">
      <span className="flex items-center gap-1.75">
        <Logo width={13} height={15.5} />
        <span className="text-[13.5px] font-bold text-foreground-secondary">
          Pinsei
        </span>
      </span>

      <button
        type="button"
        aria-label="Refresh"
        onClick={() => queryClient.invalidateQueries()}
        disabled={isFetching}
        className="ml-auto flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground outline-hidden hover:bg-surface-hover disabled:cursor-default disabled:opacity-60 [&_svg]:size-3.5"
      >
        <RefreshCw className={isFetching ? "animate-spin" : undefined} />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label="Account"
          onClick={() => setOpen((o) => !o)}
          className="flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-accent text-[10.5px] font-semibold text-accent-foreground outline-hidden"
        >
          {avatarLabel}
        </button>

        {open && (
          <div className="absolute right-0 top-8 z-10 min-w-40 rounded-xl border border-border-subtle bg-card p-1.25 shadow-card">
            <div className="truncate px-2 pt-1 pb-1.5">
              {fullName && (
                <p className="truncate text-[11.5px] font-semibold text-foreground-secondary">
                  {fullName}
                </p>
              )}
              <p className="truncate text-[11px] font-semibold text-muted-foreground">
                {user?.email || "Account"}
              </p>
            </div>
            <a
              href="https://pinsei.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full cursor-pointer items-center gap-1.75 rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold text-foreground-secondary no-underline outline-hidden hover:bg-surface-hover [&_svg]:size-3.5"
            >
              <ExternalLink />
              Go to app
            </a>
            <button
              type="button"
              onClick={() => signOut.mutate()}
              className="flex w-full cursor-pointer items-center gap-1.75 rounded-lg border-0 bg-transparent px-2 py-1.5 text-left text-[11px] font-medium text-foreground-secondary outline-hidden hover:bg-surface-hover [&_svg]:size-3.5"
            >
              <LogOut />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
