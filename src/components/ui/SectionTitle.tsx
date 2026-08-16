import { CulturalDivider } from "./CulturalDivider";

/** Consistent section heading: kicker + title + optional divider.
 * `level` picks the heading element — page-level titles use "h1". */
export function SectionTitle({
  kicker,
  title,
  sub,
  divider = false,
  tone = "light",
  level = "h2",
}: {
  kicker?: string;
  title: string;
  sub?: string;
  divider?: boolean;
  tone?: "light" | "dark";
  level?: "h1" | "h2";
}) {
  const onDark = tone === "dark";
  const Heading = level;
  return (
    <div className="text-center">
      {kicker && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${
            onDark ? "text-gold-300" : "text-terracotta-500"
          }`}
        >
          {kicker}
        </p>
      )}
      <Heading
        className={`mt-2 font-display text-2xl md:text-3xl ${
          onDark ? "text-cream-50" : "text-forest-600"
        }`}
      >
        {title}
      </Heading>
      {sub && (
        <p
          className={`mx-auto mt-2 max-w-2xl font-deva text-sm leading-relaxed md:text-base ${
            onDark ? "text-cream-200/85" : "text-ink-700"
          }`}
        >
          {sub}
        </p>
      )}
      {divider && (
        <div className="mt-4">
          <CulturalDivider className={onDark ? "text-gold-400" : "text-terracotta-500"} />
        </div>
      )}
    </div>
  );
}
