import type { GrammarTable as TableData, Cell } from "@/data/grammar/types";

function cellClass(cell: Cell): string {
  switch (cell.script) {
    case "gondi":
      return "font-gondi text-xl text-terracotta-700";
    case "en":
      return "text-ink-700";
    default:
      return "font-deva text-base text-ink-800";
  }
}

/** Responsive table — scrolls horizontally on small screens. */
export function GrammarTable({ table }: { table: TableData }) {
  return (
    <figure className="mt-3">
      {table.caption && (
        <figcaption className="mb-2 text-sm font-medium text-ink-700/80">
          {table.caption}
        </figcaption>
      )}
      <div
        className="overflow-x-auto rounded-xl border border-ink-800/10"
        tabIndex={0}
        role="group"
        aria-label={table.caption ?? "Grammar table"}
      >
        <table className="w-full border-collapse bg-white/60 text-left">
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="whitespace-nowrap border-b-2 border-terracotta-500/25 bg-cream-200/70 px-3 py-2 font-deva text-sm font-semibold text-terracotta-700"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className={i % 2 ? "bg-cream-100/60" : ""}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`whitespace-nowrap border-b border-ink-800/10 px-3 py-2 align-middle ${cellClass(cell)}`}
                  >
                    {cell.text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
