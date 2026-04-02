import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { INITIAL_TRANSACTIONS } from "../data/mockData";

// ============================================================
//  1. INITIAL STATE
//  This is the single source of truth for the entire app.
//  Every component reads from here — nothing is stored locally
//  inside components (except UI-only state like modal open/close).
// ============================================================
const initialState = {
  // Load from localStorage if exists, else use mock data
  transactions: JSON.parse(localStorage.getItem("fin_transactions")) ||
    INITIAL_TRANSACTIONS,

  // Filters — used in Transactions page
  filters: {
    search: "",
    category: "All",
    type: "All",
    sortBy: "date_desc",   // date_desc | date_asc | amount_desc | amount_asc
  },

  // Role-based UI — "admin" can add/edit/delete, "viewer" is read-only
  role: localStorage.getItem("fin_role") || "viewer",

  // Dark mode
  darkMode: JSON.parse(localStorage.getItem("fin_darkMode")) || false,
};

// ============================================================
//  2. ACTION TYPES
//  String constants prevent typos when dispatching actions.
//  Every state change in the app goes through one of these.
// ============================================================
export const ACTIONS = {
  ADD_TRANSACTION:    "ADD_TRANSACTION",
  EDIT_TRANSACTION:   "EDIT_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  SET_FILTER:         "SET_FILTER",
  RESET_FILTERS:      "RESET_FILTERS",
  SET_ROLE:           "SET_ROLE",
  TOGGLE_DARK_MODE:   "TOGGLE_DARK_MODE",
};

// ============================================================
//  3. REDUCER
//  A pure function — takes current state + action, returns NEW
//  state. Never mutates state directly (always spread).
//  React re-renders only when state reference changes.
// ============================================================
function reducer(state, action) {
  switch (action.type) {

    // -- Add a brand-new transaction (Admin only) -------------
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        // Prepend so newest shows first in the list
        transactions: [action.payload, ...state.transactions],
      };

    // -- Edit an existing transaction (Admin only) -----------
    case ACTIONS.EDIT_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((txn) =>
          // Replace only the transaction whose id matches
          txn.id === action.payload.id ? action.payload : txn
        ),
      };

    // -- Delete a transaction (Admin only) -------------------
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          (txn) => txn.id !== action.payload // payload is just the id
        ),
      };

    // -- Update a single filter field ------------------------
    //    action.payload = { key: "category", value: "Food & Dining" }
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    // -- Clear all filters back to defaults ------------------
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    // -- Switch between "admin" and "viewer" -----------------
    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };

    // -- Toggle dark / light mode ----------------------------
    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };

    // -- Fallback (unknown action) — return state unchanged --
    default:
      return state;
  }
}

// ============================================================
//  4. CONTEXT CREATION
//  Two separate contexts:
//  - AppStateContext  → read-only state + derived data
//  - AppDispatchContext → dispatch function
//
//  Why split? A component that only dispatches (like a button)
//  won't re-render when state changes — better performance.
// ============================================================
const AppStateContext    = createContext(null);
const AppDispatchContext = createContext(null);

// ============================================================
//  5. DERIVED DATA HELPERS
//  These are pure functions that COMPUTE values from
//  transactions. They are wrapped in useMemo inside the
//  provider so they only recalculate when transactions change.
// ============================================================

// Total income across all transactions
const calcTotalIncome = (txns) =>
  txns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

// Total expenses across all transactions
const calcTotalExpenses = (txns) =>
  txns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

// Group transactions by month → used for the Balance Trend chart
// Returns array like: [{ month: "Jan 25", income: 107000, expense: 11579 }, ...]
const calcMonthlyData = (txns) => {
  const map = {};

  txns.forEach((t) => {
    // "2025-01-03" → "Jan 25"
    const date  = new Date(t.date);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      year:  "2-digit",
    });

    if (!map[label]) map[label] = { month: label, income: 0, expense: 0 };

    if (t.type === "income")  map[label].income  += t.amount;
    if (t.type === "expense") map[label].expense += t.amount;
  });

  // Sort chronologically so the chart line flows left → right
  return Object.values(map).sort((a, b) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];
    const [aM, aY] = a.month.split(" ");
    const [bM, bY] = b.month.split(" ");
    return aY !== bY
      ? Number(aY) - Number(bY)
      : months.indexOf(aM) - months.indexOf(bM);
  });
};

// Group expenses by category → used for the Pie / Donut chart
// Returns array like: [{ category: "Food & Dining", amount: 13980 }, ...]
const calcCategoryData = (txns) => {
  const map = {};

  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!map[t.category]) map[t.category] = { category: t.category, amount: 0 };
      map[t.category].amount += t.amount;
    });

  // Sort descending so biggest slice comes first
  return Object.values(map).sort((a, b) => b.amount - a.amount);
};

// ============================================================
//  6. PROVIDER COMPONENT
//  Wrap the entire app with this. It:
//  - Holds state via useReducer
//  - Persists to localStorage on every state change
//  - Computes derived data with useMemo (only when txns change)
//  - Exposes everything via two contexts
// ============================================================
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Persist to localStorage whenever these values change ──
  useEffect(() => {
    localStorage.setItem("fin_transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem("fin_role", state.role);
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem("fin_darkMode", JSON.stringify(state.darkMode));
  }, [state.darkMode]);

  // ── Derived / computed values (recalc only when txns change) ──
  const derived = useMemo(() => {
    const totalIncome   = calcTotalIncome(state.transactions);
    const totalExpenses = calcTotalExpenses(state.transactions);

    return {
      totalIncome,
      totalExpenses,
      totalBalance:  totalIncome - totalExpenses,  // net balance
      monthlyData:   calcMonthlyData(state.transactions),  // for trend chart
      categoryData:  calcCategoryData(state.transactions), // for pie chart
      // Highest spending category (for Insights)
      topCategory:   calcCategoryData(state.transactions)[0] || null,
    };
  }, [state.transactions]);

  // ── What consumers receive ────────────────────────────────
  const stateValue = { ...state, ...derived };

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={stateValue}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  );
}

// ============================================================
//  7. CUSTOM HOOKS
//  Import these in any component — cleaner than useContext.
//
//  useAppState()    → get all state + derived data
//  useAppDispatch() → get dispatch to trigger actions
// ============================================================
export const useAppState    = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);