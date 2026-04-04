import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";

export default function TransactionFilters() {
  const { filters } = useAppState();
  const dispatch    = useAppDispatch();

  const set = (key, value) =>
    dispatch({ type: ACTIONS.SET_FILTER, payload: { key, value } });

  const hasActive =
    filters.search !== "" || filters.category !== "All" ||
    filters.type !== "All" || filters.sortBy !== "date_desc";

  return (
    <div className="glass rounded-3xl p-5 fade-up">
      <div className="flex flex-col gap-3">
        {/* Search row */}
        <div className="flex gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              className="w-full rounded-2xl bg-white/60 border border-orange-200
                         pl-10 pr-4 py-2.5 text-orange-900 placeholder-orange-300
                         focus:outline-none focus:ring-2 focus:ring-orange-200
                         focus:border-orange-400 transition-all duration-200 text-sm font-medium"
            />
          </div>
          {hasActive && (
            <button
              onClick={() => dispatch({ type: ACTIONS.RESET_FILTERS })}
              className="px-4 py-2.5 rounded-2xl bg-white/80 border border-orange-200
                         text-orange-600 text-sm font-bold hover:bg-orange-50
                         transition-all duration-200 whitespace-nowrap"
            >
              ✕ Reset
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: "category", label: "All Categories",
              options: CATEGORIES.map((c) => ({ value: c, label: c })) },
            { key: "type", label: "All Types",
              options: [
                { value: "income",  label: "💰 Income"  },
                { value: "expense", label: "💸 Expense" },
              ]},
            { key: "sortBy", label: null,
              options: [
                { value: "date_desc",   label: "📅 Newest First"   },
                { value: "date_asc",    label: "📅 Oldest First"   },
                { value: "amount_desc", label: "💰 Highest Amount" },
                { value: "amount_asc",  label: "💰 Lowest Amount"  },
              ]},
          ].map(({ key, label, options }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) => set(key, e.target.value)}
              className="flex-1 min-w-[140px] rounded-2xl bg-white/60 border border-orange-200
                         px-4 py-2.5 text-sm font-semibold text-orange-800
                         focus:outline-none focus:ring-2 focus:ring-orange-200
                         focus:border-orange-400 transition-all duration-200 cursor-pointer"
            >
              {label && <option value="All">{label}</option>}
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </div>
  );
}