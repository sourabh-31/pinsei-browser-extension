export function Logo({
  width = 15,
  height = 18,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="1 1 17 20.5"
      fill="none"
      aria-label="Pinsei"
      className="block shrink-0"
    >
      <defs>
        <linearGradient id="pinsei-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.72 0.19 22)" />
          <stop offset="1" stopColor="oklch(0.55 0.216 4)" />
        </linearGradient>
      </defs>
      <path
        d="M13.4 1.5H18v17.2l-4.6-3.4V1.5Z"
        fill="oklch(0.55 0.216 4)"
        opacity="0.28"
      />
      <path
        d="M1 2.4A1.4 1.4 0 0 1 2.4 1h8.9a1.4 1.4 0 0 1 1.4 1.4v19.1l-5.85-4.3L1 21.5V2.4Z"
        fill="url(#pinsei-logo)"
      />
    </svg>
  );
}
