import { useState, useEffect } from "react";
import { useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORIES, CATEGORY_ICONS, generateId } from "../../data/mockData";
import { theme } from "../../theme";

// ── Blank form state ──────────────────────────────────────────
const EMPTY_FORM = {
  description: "",
  amount:      "",
  category:    "Food & Dining",
  type:        "expense",
  date:        new Date().toISOString().split("T")[0], // today
};

export default function AddTransactionModal({ open, onClose, editData }) {
  const dispatch      = useAppDispatch();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(editData);

  // Populate form when editing an existing transaction
  useEffect(() => {
    if (editData) setForm(editData);
    else          setForm(EMPTY_FORM);
    setErrors({});
  }, [editData, open]);

  if (!open) return null;

  // ── Field change handler ────────────────────────────────
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Validation ──────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.description.trim())      e.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid positive amount";
    if (!form.date)                    e.date = "Date is required";
    return e;
  };

  // ── Submit ──────────────────────────────────────────────
  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = {
      ...form,
      id:     isEditing ? form.id : generateId(),
      amount: Number(form.amount), // ensure number not string
    };

    dispatch({
      type:    isEditing ? ACTIONS.EDIT_TRANSACTION : ACTIONS.ADD_TRANSACTION,
      payload,
    });

    onClose();
  };

  return (
    // ── Backdrop ──────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(124,45,18,0.15)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal Box ───────────────────────────────────── */}
      <div
        className={`
          w-full max-w-md rounded-3xl
          bg-white shadow-2xl shadow-orange-200
          border border-orange-100
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className={`${theme.gradient.hero} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "✏️ Edit Transaction" : "➕ Add Transaction"}
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                {isEditing
                  ? "Update the transaction details"
                  : "Fill in the details below"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30
                         flex items-center justify-center text-white
                         transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Description */}
          <div>
            <label className={`block text-xs font-semibold ${theme.text.secondary} mb-1.5`}>
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={theme.input.base}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-xs font-semibold ${theme.text.secondary} mb-1.5`}>
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2
                               font-bold text-orange-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={`${theme.input.base} pl-8`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Type toggle */}
          <div>
            <label className={`block text-xs font-semibold ${theme.text.secondary} mb-1.5`}>
              Type
            </label>
            <div className="flex gap-2">
              {["income", "expense"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleChange("type", t)}
                  className={`
                    flex-1 py-2 rounded-xl text-sm font-semibold
                    border transition-all duration-200 capitalize
                    ${form.type === t
                      ? t === "income"
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "bg-red-100 border-red-400 text-red-700"
                      : "bg-orange-50 border-orange-200 text-orange-400 hover:bg-orange-100"}
                  `}
                >
                  {t === "income" ? "💰 Income" : "💸 Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={`block text-xs font-semibold ${theme.text.secondary} mb-1.5`}>
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={theme.input.select}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={`block text-xs font-semibold ${theme.text.secondary} mb-1.5`}>
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={theme.input.base}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className={`flex-1 ${theme.button.secondary}`}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={`flex-1 ${theme.button.primary}`}>
            {isEditing ? "💾 Save Changes" : "➕ Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}