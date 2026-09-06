import { RotateCcw, Trash2 } from "lucide-react";

interface UndoBannerProps {
  title: string;
  onUndo: () => void;
}

export function UndoBanner({ title, onUndo }: UndoBannerProps) {
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex justify-center">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-foreground px-3.5 py-2 shadow-popup">
        <Trash2 size={13} className="shrink-0 text-background/70" />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] font-semibold text-background">
          Removed &quot;{title}&quot;
        </span>
        <button
          type="button"
          onClick={onUndo}
          className="ml-1 flex shrink-0 cursor-pointer items-center gap-1 rounded-full border-0 bg-background/15 px-2 py-0.75 text-[11px] font-bold text-background outline-hidden hover:bg-background/25"
        >
          <RotateCcw size={11} />
          Undo
        </button>
      </div>
    </div>
  );
}
