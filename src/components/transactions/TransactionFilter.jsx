import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { theme } from "../../theme";

export default function TransactionFilters() {
  const { filters } = useAppState();
  const dispatch    = useAppDispatch();

  // Single handler for all filter fields
  const set = (key, value) =>
    dispatch({ type: ACTIONS.SET_FILTER, payload: { key, value } });

  const reset = () => dispatch({ type: ACTIONS.RESET_FILTERS });

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "All" ||
    filters.type !== "All" ||
    filters.sortBy !== "date_desc";

  return (
    <div
      className={`
        ${theme.card.base} flex flex-col gap-4
      `}
    >
      {/* ── Row 1 : Search + Reset ───────────────────────── */}
      <div className="flex gap-3 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className={`${theme.input.base} pl-9`}
          />
        </div>

        {/* Reset — only visible when filters are active */}
        {hasActiveFilters && (
          <button onClick={reset} className={theme.button.secondary}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* ── Row 2 : Category + Type + Sort ──────────────── */}
      <div className="flex flex-wrap gap-3">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className={`${theme.input.select} flex-1 min-w-[140px]`}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => set("type", e.target.value)}
          className={`${theme.input.select} flex-1 min-w-[120px]`}
        >
          <option value="All">All Types</option>
          <option value="income">💰 Income</option>
          <option value="expense">💸 Expense</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => set("sortBy", e.target.value)}
          className={`${theme.input.select} flex-1 min-w-[160px]`}
        >
          <option value="date_desc">📅 Newest First</option>
          <option value="date_asc">📅 Oldest First</option>
          <option value="amount_desc">💰 Highest Amount</option>
          <option value="amount_asc">💰 Lowest Amount</option>
        </select>
      </div>
    </div>
  );
}