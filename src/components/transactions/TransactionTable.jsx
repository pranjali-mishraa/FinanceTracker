import { useState, useMemo } from "react";
import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORY_ICONS } from "../../data/mockData";
import AddTransactionModal from "./AddTransactionModal";

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(v);

const applyFilters = (transactions, filters) => {
  let r = [...transactions];
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    r = r.filter((t) =>
      t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  if (filters.category !== "All") r = r.filter((t) => t.category === filters.category);
  if (filters.type !== "All")     r = r.filter((t) => t.type === filters.type);
  switch (filters.sortBy) {
    case "date_asc":    r.sort((a,b) => new Date(a.date) - new Date(b.date)); break;
    case "date_desc":   r.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
    case "amount_desc": r.sort((a,b) => b.amount - a.amount); break;
    case "amount_asc":  r.sort((a,b) => a.amount - b.amount); break;
  }
  return r;
};

const PAGE_SIZES = [10, 20, 50];

export default function TransactionTable() {
  const { transactions, filters, role } = useAppState();
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered   = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);
  useMemo(() => setPage(1), [filters]);

  const openEdit = (txn) => { setEditData(txn); setModalOpen(true); };
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?"))
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  };

  return (
    <>
      <div className="glass rounded-3xl p-6 fade-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-orange-950">
              Transactions
            </h2>
            <p className="text-orange-400 text-xs mt-1 font-medium">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {role === "admin" && (
            <button onClick={() => { setEditData(null); setModalOpen(true); }}
              className="btn-glow text-white font-bold px-5 py-2.5 rounded-2xl text-sm tracking-wide">
              ➕ Add Transaction
            </button>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Date","Description","Category","Type","Amount",
                  ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                  <th key={h}
                    className={`px-4 py-3 text-left text-xs font-bold text-orange-500
                                uppercase tracking-widest first:rounded-l-2xl last:rounded-r-2xl
                                bg-gradient-to-r from-orange-50 to-pink-50
                                ${h === "Amount" || h === "Actions" ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5}
                    className="text-center py-20 text-orange-300 text-sm font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">😕</span>
                      No transactions match your filters
                    </div>
                  </td>
                </tr>
              ) : paginated.map((txn, i) => (
                <tr key={txn.id}
                  className="group border-b border-orange-50/80 last:border-0
                             hover:bg-orange-50/60 transition-colors duration-150"
                  style={{ animationDelay: `${i * 30}ms` }}>

                  <td className="px-4 py-3.5 text-orange-400 text-xs font-semibold whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-orange-950">
                    {txn.description}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold
                                     bg-gradient-to-r from-orange-100 to-pink-100
                                     text-orange-800 border border-orange-200/60">
                      {CATEGORY_ICONS[txn.category]} {txn.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${txn.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-600"}`}>
                      {txn.type === "income" ? "💰 Income" : "💸 Expense"}
                    </span>
                  </td>

                  <td className={`px-4 py-3.5 font-bold text-right whitespace-nowrap
                    ${txn.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                    {txn.type === "income" ? "+" : "−"}{fmt(txn.amount)}
                  </td>

                  {role === "admin" && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => openEdit(txn)}
                          className="p-2 rounded-xl hover:bg-orange-100 text-orange-500
                                     transition-all duration-200 hover:scale-110"
                          title="Edit">✏️</button>
                        <button onClick={() => handleDelete(txn.id)}
                          className="p-2 rounded-xl hover:bg-rose-100 text-rose-400
                                     transition-all duration-200 hover:scale-110"
                          title="Delete">🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-orange-300 text-sm font-medium">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">😕</span>
                No transactions match your filters
              </div>
            </div>
          ) : paginated.map((txn) => (
            <div key={txn.id}
              className="rounded-2xl p-4 bg-gradient-to-br from-orange-50/80 to-pink-50/60
                         border border-orange-100/80 hover:shadow-md hover:shadow-orange-100
                         transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm text-orange-950">{txn.description}</p>
                  <p className="text-xs text-orange-400 mt-0.5 font-medium">
                    {new Date(txn.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-sm font-bold
                  ${txn.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                  {txn.type === "income" ? "+" : "−"}{fmt(txn.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold
                                   bg-gradient-to-r from-orange-100 to-pink-100
                                   text-orange-800 border border-orange-200/60">
                    {CATEGORY_ICONS[txn.category]} {txn.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                    ${txn.type === "income"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"}`}>
                    {txn.type === "income" ? "💰" : "💸"} {txn.type}
                  </span>
                </div>
                {role === "admin" && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(txn)}
                      className="p-1.5 rounded-xl hover:bg-orange-100 text-orange-500
                                 transition-all duration-200">✏️</button>
                    <button onClick={() => handleDelete(txn.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-400
                                 transition-all duration-200">🗑️</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6
                          pt-5 border-t border-orange-100/80">
            <div className="flex items-center gap-2 text-xs text-orange-500 font-semibold">
              <span>Rows per page:</span>
              <select value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="rounded-xl border border-orange-200 bg-white/60 px-2.5 py-1
                           text-xs text-orange-800 font-bold focus:outline-none
                           focus:ring-1 focus:ring-orange-200 cursor-pointer">
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-orange-400 font-medium">
                Page {page} of {totalPages}
              </span>
              {[
                { label: "← Prev", action: () => setPage((p) => p - 1), disabled: page === 1 },
                { label: "Next →", action: () => setPage((p) => p + 1), disabled: page === totalPages },
              ].map(({ label, action, disabled }) => (
                <button key={label} onClick={action} disabled={disabled}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold border border-orange-200
                             bg-white/70 text-orange-700 hover:bg-orange-100
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all duration-200 hover:scale-105 active:scale-95">
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
    </>
  );
}