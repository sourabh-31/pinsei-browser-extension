import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentProps<"input"> {
  isSearchIcon?: boolean;
}

export function Input({
  className,
  isSearchIcon = false,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {isSearchIcon && (
        <Search
          size={13}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      )}
      <input
        className={cn(
          "h-8 w-full min-w-0 rounded-[10px] border border-border bg-card text-[12.5px] font-medium shadow-field outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 hover:border-[oklch(0.9_0.004_300)] focus-visible:border-ring",
          isSearchIcon ? "pl-7.5 pr-2.5" : "px-2.5",
          className,
        )}
        {...props}
      />
    </div>
  );
}
