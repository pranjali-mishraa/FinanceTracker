import { useState, useMemo } from "react";
import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORY_ICONS } from "../../data/mockData";
import { theme } from "../../theme";
import AddTransactionModal from "./AddTransactionModal";

// ── Currency formatter ────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

// ── Apply filters + sort to raw transactions ──────────────────
const applyFilters = (transactions, filters) => {
  let result = [...transactions];

  // Search — matches description or category
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // Category
  if (filters.category !== "All")
    result = result.filter((t) => t.category === filters.category);

  // Type
  if (filters.type !== "All")
    result = result.filter((t) => t.type === filters.type);

  // Sort
  switch (filters.sortBy) {
    case "date_asc":
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "date_desc":
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "amount_desc":
      result.sort((a, b) => b.amount - a.amount);
      break;
    case "amount_asc":
      result.sort((a, b) => a.amount - b.amount);
      break;
    default:
      break;
  }

  return result;
};

// ── Rows per page options ─────────────────────────────────────
const PAGE_SIZES = [10, 20, 50];

export default function TransactionTable() {
  const { transactions, filters, role } = useAppState();
  const dispatch = useAppDispatch();

  // Modal state — local UI only
  const [modalOpen, setModalOpen] = useState(false);
  const [editData,  setEditData]  = useState(null);

  // Pagination state
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered + sorted list (recomputes only when deps change)
  const filtered = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters]
  );

  // Paginated slice
  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated   = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 whenever filters change
  useMemo(() => setPage(1), [filters]);

  // ── Handlers ───────────────────────────────────────────────
  const openAdd = () => { setEditData(null); setModalOpen(true); };

  const openEdit = (txn) => { setEditData(txn); setModalOpen(true); };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?"))
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  };

  return (
    <>
      {/* ── Table Card ─────────────────────────────────────── */}
      <div className={theme.card.base}>

        {/* Header row */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className={`text-base font-bold ${theme.text.heading}`}>
              Transactions
            </h2>
            <p className={`text-xs ${theme.text.muted} mt-0.5`}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Add button — Admin only */}
          {role === "admin" && (
            <button onClick={openAdd} className={theme.button.primary}>
              ➕ Add Transaction
            </button>
          )}
        </div>

        {/* ── Desktop Table ──────────────────────────────────── */}
        <div className="hidden md:block overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-orange-100 to-pink-50">
                {["Date", "Description", "Category", "Type", "Amount",
                  ...(role === "admin" ? ["Actions"] : [])
                ].map((h) => (
                  <th
                    key={h}
                    className={`
                      px-4 py-3 text-left text-xs font-bold
                      ${theme.text.secondary} tracking-wide
                      ${h === "Amount" || h === "Actions" ? "text-right" : ""}
                    `}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-orange-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? 6 : 5}
                    className="text-center py-16 text-orange-300 text-sm"
                  >
                    😕 No transactions match your filters
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-orange-50/60 transition-colors duration-150"
                  >
                    {/* Date */}
                    <td className={`px-4 py-3 ${theme.text.muted} whitespace-nowrap`}>
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day:   "2-digit",
                        month: "short",
                        year:  "numeric",
                      })}
                    </td>

                    {/* Description */}
                    <td className={`px-4 py-3 font-medium ${theme.text.primary}`}>
                      {txn.description}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className={theme.badge.category}>
                        {CATEGORY_ICONS[txn.category]} {txn.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span
                        className={
                          txn.type === "income"
                            ? theme.badge.income
                            : theme.badge.expense
                        }
                      >
                        {txn.type === "income" ? "💰 Income" : "💸 Expense"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`px-4 py-3 font-bold text-right whitespace-nowrap
                        ${txn.type === "income" ? "text-green-600" : "text-red-500"}`}
                    >
                      {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
                    </td>

                    {/* Actions — Admin only */}
                    {role === "admin" && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(txn)}
                            className={theme.button.icon}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="p-2 rounded-lg hover:bg-red-100
                                       text-red-400 transition-all duration-200"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ───────────────────────────────────── */}
        <div className="md:hidden flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-orange-300 text-sm">
              😕 No transactions match your filters
            </div>
          ) : (
            paginated.map((txn) => (
              <div
                key={txn.id}
                className={`
                  rounded-xl p-4 border border-orange-100
                  bg-gradient-to-br from-orange-50 to-pink-50
                `}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-semibold text-sm ${theme.text.primary}`}>
                      {txn.description}
                    </p>
                    <p className={`text-xs ${theme.text.muted} mt-0.5`}>
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold
                      ${txn.type === "income" ? "text-green-600" : "text-red-500"}`}
                  >
                    {txn.type === "income" ? "+" : "-"}{fmt(txn.amount)}
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <span className={theme.badge.category}>
                      {CATEGORY_ICONS[txn.category]} {txn.category}
                    </span>
                    <span
                      className={
                        txn.type === "income"
                          ? theme.badge.income
                          : theme.badge.expense
                      }
                    >
                      {txn.type === "income" ? "💰" : "💸"} {txn.type}
                    </span>
                  </div>

                  {/* Admin actions */}
                  {role === "admin" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(txn)}
                        className={theme.button.icon}
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="p-2 rounded-lg hover:bg-red-100
                                   text-red-400 transition-all duration-200"
                      >🗑️</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-orange-100">
            {/* Page size */}
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="rounded-lg border border-orange-200 bg-orange-50
                           px-2 py-1 text-xs text-orange-800
                           focus:outline-none focus:ring-1 focus:ring-orange-300"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Page info + controls */}
            <div className="flex items-center gap-2">
              <span className={`text-xs ${theme.text.muted}`}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`
                  px-3 py-1 rounded-lg text-xs font-semibold
                  border border-orange-200 bg-orange-50 text-orange-700
                  hover:bg-orange-100 disabled:opacity-40
                  disabled:cursor-not-allowed transition-all duration-200
                `}
              >
                ← Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`
                  px-3 py-1 rounded-lg text-xs font-semibold
                  border border-orange-200 bg-orange-50 text-orange-700
                  hover:bg-orange-100 disabled:opacity-40
                  disabled:cursor-not-allowed transition-all duration-200
                `}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
    </>
  );
}