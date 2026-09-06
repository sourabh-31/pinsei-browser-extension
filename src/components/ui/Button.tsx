import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "icon-sm";

const variants: Record<Variant, string> = {
  default:
    "border-none bg-gradient-primary text-primary-foreground shadow-cta-sm",
  secondary:
    "border border-border bg-card text-foreground-secondary shadow-field hover:border-[oklch(0.42_0.09_8)] hover:text-accent-foreground",
  ghost:
    "border-none bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  destructive:
    "border-none bg-destructive/10 text-destructive hover:bg-destructive/20",
};

const sizes: Record<Size, string> = {
  sm: "h-7.5 gap-1 rounded-[9px] px-2.5 text-[12px] font-semibold",
  md: "h-8.5 gap-1.5 rounded-[10px] px-3.5 text-[12.5px] font-semibold",
  "icon-sm": "size-7 rounded-full",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-sans transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
