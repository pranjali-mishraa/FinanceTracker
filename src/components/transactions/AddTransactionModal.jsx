import { useState, useEffect } from "react";
import { useAppDispatch, ACTIONS } from "../../context/AppContext";
import { CATEGORIES, CATEGORY_ICONS, generateId } from "../../data/mockData";

const EMPTY = {
  description: "", amount: "", category: "Food & Dining",
  type: "expense", date: new Date().toISOString().split("T")[0],
};

export default function AddTransactionModal({ open, onClose, editData }) {
  const dispatch = useAppDispatch();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(editData);

  useEffect(() => {
    setForm(editData || EMPTY);
    setErrors({});
  }, [editData, open]);

  if (!open) return null;

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    dispatch({
      type:    isEditing ? ACTIONS.EDIT_TRANSACTION : ACTIONS.ADD_TRANSACTION,
      payload: { ...form, id: isEditing ? form.id : generateId(), amount: Number(form.amount) },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(124,45,18,0.2)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-3xl overflow-hidden fade-up"
        style={{ boxShadow: "0 24px 64px rgba(124,45,18,0.25)" }}>

        {/* Modal header */}
        <div className="px-7 py-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#ea580c,#f97316,#ec4899)" }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle,white,transparent 70%)" }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                {isEditing ? "✏️ Edit Transaction" : "➕ New Transaction"}
              </h2>
              <p className="text-white/65 text-xs mt-0.5">
                {isEditing ? "Update transaction details" : "Fill in the details below"}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/35
                         flex items-center justify-center text-white font-bold
                         transition-all duration-200 hover:scale-110">
              ✕
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="bg-white/95 backdrop-blur-xl px-7 py-6 flex flex-col gap-4">

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Description
            </label>
            <input type="text" placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-2xl bg-orange-50/80 border border-orange-200
                         px-4 py-2.5 text-orange-950 placeholder-orange-300 text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400
                         transition-all duration-200"
            />
            {errors.description && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.description}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-orange-400 text-sm">₹</span>
              <input type="number" placeholder="0" min="1"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className="w-full rounded-2xl bg-orange-50/80 border border-orange-200
                           pl-8 pr-4 py-2.5 text-orange-950 text-sm font-bold
                           focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400
                           transition-all duration-200"
              />
            </div>
            {errors.amount && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.amount}</p>}
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {["income", "expense"].map((t) => (
                <button key={t} onClick={() => set("type", t)}
                  className={`
                    flex-1 py-2.5 rounded-2xl text-sm font-bold border-2
                    transition-all duration-200 capitalize
                    ${form.type === t
                      ? t === "income"
                        ? "bg-emerald-100 border-emerald-400 text-emerald-700 scale-[1.02]"
                        : "bg-rose-100 border-rose-400 text-rose-600 scale-[1.02]"
                      : "bg-orange-50 border-orange-200 text-orange-400 hover:bg-orange-100"}
                  `}>
                  {t === "income" ? "💰 Income" : "💸 Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Category
            </label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-2xl bg-orange-50/80 border border-orange-200
                         px-4 py-2.5 text-orange-900 text-sm font-semibold
                         focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400
                         transition-all duration-200 cursor-pointer">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Date
            </label>
            <input type="date" value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full rounded-2xl bg-orange-50/80 border border-orange-200
                         px-4 py-2.5 text-orange-900 text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400
                         transition-all duration-200"
            />
            {errors.date && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.date}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/95 px-7 pb-7 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-orange-50 border border-orange-200
                       text-orange-700 text-sm font-bold hover:bg-orange-100
                       transition-all duration-200">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl btn-glow text-white text-sm font-bold
                       tracking-wide transition-all duration-200">
            {isEditing ? "💾 Save Changes" : "➕ Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}