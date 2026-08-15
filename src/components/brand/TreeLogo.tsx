/** Stylised "tree of life" mark — Gond-style tree inside a terracotta disc. */
export function TreeLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-terracotta-400 to-terracotta-600 shadow-card ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-[68%] w-[68%]" fill="none">
        {/* trunk + roots */}
        <path
          d="M24 42V20M24 42c-4 0-7 1-9 2M24 42c4 0 7 1 9 2M24 42c-2 0-3 1-4 2M24 42c2 0 3 1 4 2"
          stroke="#FBF6EC"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* branches */}
        <path
          d="M24 24c-1-5-5-7-9-7M24 24c1-5 5-7 9-7M24 18c-1-4-3-6-6-7M24 18c1-4 3-6 6-7M24 14v-4"
          stroke="#FBF6EC"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* foliage dots */}
        <g fill="#FBF6EC">
          <circle cx="14" cy="14" r="2.1" />
          <circle cx="24" cy="8" r="2.3" />
          <circle cx="34" cy="14" r="2.1" />
          <circle cx="18" cy="9.5" r="1.6" />
          <circle cx="30" cy="9.5" r="1.6" />
          <circle cx="10.5" cy="19" r="1.6" />
          <circle cx="37.5" cy="19" r="1.6" />
        </g>
      </svg>
    </span>
  );
}
