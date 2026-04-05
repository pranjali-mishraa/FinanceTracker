import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";

export default function TransactionFilters() {
  const { filters, darkMode } = useAppState();
  const dispatch              = useAppDispatch();

  const set = (key, value) =>
    dispatch({ type: ACTIONS.SET_FILTER, payload: { key, value } });

  const hasActive =
    filters.search !== "" || filters.category !== "All" ||
    filters.type !== "All" || filters.sortBy !== "date_desc";

  const cardStyle = {
    background:     darkMode ? "#1e1e1e" : "rgba(255,255,255,0.92)",
    border:         darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(249,115,22,0.1)",
    borderRadius:   "20px",
    padding:        "20px 24px",
    boxShadow:      darkMode ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(249,115,22,0.06)",
  };

  const inputStyle = {
    width:        "100%",
    padding:      "10px 16px",
    borderRadius: "12px",
    fontSize:     "14px",
    fontWeight:   "500",
    outline:      "none",
    transition:   "all 0.2s ease",
    background:   darkMode ? "#2a2a2a" : "rgba(255,247,240,0.8)",
    border:       darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(249,115,22,0.15)",
    color:        darkMode ? "#e0e0e0" : "#431407",
  };

  const labelStyle = {
    fontSize:      "11px",
    fontWeight:    "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom:  "6px",
    display:       "block",
    color:         darkMode ? "#808080" : "#c2855a",
  };

  return (
    <div style={cardStyle}>

      {/* ── Row 1: Search + Reset ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Search</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position:  "absolute",
              left:      "14px",
              top:       "50%",
              transform: "translateY(-50%)",
              fontSize:  "14px",
              color:     darkMode ? "#606060" : "#d4956a",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              style={{ ...inputStyle, paddingLeft: "40px" }}
            />
          </div>
        </div>

        {hasActive && (
          <button
            onClick={() => dispatch({ type: ACTIONS.RESET_FILTERS })}
            style={{
              padding:      "10px 18px",
              borderRadius: "12px",
              fontSize:     "13px",
              fontWeight:   "700",
              cursor:       "pointer",
              transition:   "all 0.2s ease",
              whiteSpace:   "nowrap",
              background:   darkMode ? "#2a2a2a" : "rgba(255,247,240,0.8)",
              border:       darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(249,115,22,0.2)",
              color:        darkMode ? "#d0d0d0" : "#c2410c",
              marginBottom: "0px",
              alignSelf:    "flex-end",
            }}
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* ── Row 2: Filters ── */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

        {/* Category */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label style={labelStyle}>Category</label>
          <select
            value={filters.category}
            onChange={(e) => set("category", e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div style={{ flex: 1, minWidth: "140px" }}>
          <label style={labelStyle}>Type</label>
          <select
            value={filters.type}
            onChange={(e) => set("type", e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Types</option>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label style={labelStyle}>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => set("sortBy", e.target.value)}
            style={inputStyle}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>

      </div>
    </div>
  );
}