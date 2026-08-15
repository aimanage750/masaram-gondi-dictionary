/** Thin tribal-motif divider (SVG line + diamond/eye pattern), like the reference. */
export function CulturalDivider({
  className = "text-terracotta-500",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 ${className}`}>
      <svg viewBox="0 0 120 12" className="h-3 w-24 max-w-[26vw] sm:w-32" fill="none">
        <path d="M0 6h38M82 6h38" stroke="currentColor" strokeWidth="1.4" />
        <path d="M42 6l4-4 4 4-4 4zM54 6l4-4 4 4-4 4zM66 6l4-4 4 4-4 4z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="46" cy="6" r="1.1" fill="currentColor" />
        <circle cx="58" cy="6" r="1.1" fill="currentColor" />
        <circle cx="70" cy="6" r="1.1" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M12 3l3 4 5 1-3.5 4L17.5 17 12 14.8 6.5 17 7.5 12 4 8l5-1z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="1.4" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 120 12" className="h-3 w-24 max-w-[26vw] rotate-180 sm:w-32" fill="none">
        <path d="M0 6h38M82 6h38" stroke="currentColor" strokeWidth="1.4" />
        <path d="M42 6l4-4 4 4-4 4zM54 6l4-4 4 4-4 4zM66 6l4-4 4 4-4 4z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="46" cy="6" r="1.1" fill="currentColor" />
        <circle cx="58" cy="6" r="1.1" fill="currentColor" />
        <circle cx="70" cy="6" r="1.1" fill="currentColor" />
      </svg>
    </div>
  );
}
