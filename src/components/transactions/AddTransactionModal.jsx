import { useState, useEffect } from "react";
import { useAppDispatch, useAppState, ACTIONS } from "../../context/AppContext";
import { CATEGORIES, CATEGORY_ICONS, generateId } from "../../data/mockData";

const EMPTY = {
  description: "", amount: "", category: "Food & Dining",
  type: "expense", date: new Date().toISOString().split("T")[0],
};

export default function AddTransactionModal({ open, onClose, editData,darkMode }) {
  const dispatch        = useAppDispatch();
  // const { darkMode }    = useAppState();
  const [form, setForm] = useState(EMPTY);
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
      payload: {
        ...form,
        id:     isEditing ? form.id : generateId(),
        amount: Number(form.amount),
      },
    });
    onClose();
  };

  // ── Dynamic styles based on darkMode ─────────────────────
  const modalBg   = darkMode ? "#1e1e1e"                    : "rgba(255,255,255,0.97)";
  const inputBg   = darkMode ? "#2a2a2a"                    : "rgba(255,247,240,0.8)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.1)"    : "rgba(249,115,22,0.2)";
  const inputColor  = darkMode ? "#f0f0f0"                  : "#431407";
  const labelColor  = darkMode ? "#a08878"                  : "#c2855a";
  const bodyBorder  = darkMode ? "rgba(255,255,255,0.08)"   : "rgba(249,115,22,0.12)";

  const inputStyle = {
    width:        "100%",
    padding:      "10px 14px",
    borderRadius: "12px",
    border:       `1px solid ${inputBorder}`,
    background:   inputBg,
    fontSize:     "14px",
    fontWeight:   "500",
    color:        inputColor,
    outline:      "none",
    transition:   "all 0.2s ease",
  };

  const labelStyle = {
    fontSize:      "11px",
    fontWeight:    "700",
    color:         labelColor,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom:  "6px",
    display:       "block",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         50,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "16px",
        background:     darkMode ? "rgba(0,0,0,0.6)" : "rgba(67,20,7,0.15)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width:        "100%",
          maxWidth:     "440px",
          borderRadius: "28px",
          overflow:     "hidden",
          background:   modalBg,
          boxShadow:    darkMode
            ? "0 24px 60px rgba(0,0,0,0.5)"
            : "0 24px 60px rgba(249,115,22,0.15), 0 4px 16px rgba(0,0,0,0.06)",
          border: `1px solid ${bodyBorder}`,
        }}
      >

        {/* ── Header — keep gradient always, looks good on both ── */}
        <div style={{
          background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ec4899 100%)",
          padding:    "24px 28px 20px",
        }}>
          <h2 style={{
            fontSize:   "20px",
            fontWeight: "800",
            color:      "#fff",
            margin:     0,
            fontFamily: "'Playfair Display', serif",
          }}>
            {isEditing ? "Edit Transaction" : "New Transaction"}
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
            {isEditing ? "Update the details below" : "Fill in the details below"}
          </p>
        </div>

        {/* ── Body ── */}
        <div style={{
          padding:         "24px 28px",
          display:         "flex",
          flexDirection:   "column",
          gap:             "18px",
          background:      modalBg,
        }}>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              style={inputStyle}
            />
            {errors.description && (
              <p style={{ color: "#e11d48", fontSize: "12px", marginTop: "4px" }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}>Amount (₹)</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position:  "absolute",
                left:      "14px",
                top:       "50%",
                transform: "translateY(-50%)",
                fontWeight:"700",
                color:     "#fb923c",
                fontSize:  "15px",
              }}>₹</span>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                style={{ ...inputStyle, paddingLeft: "32px" }}
              />
            </div>
            {errors.amount && (
              <p style={{ color: "#e11d48", fontSize: "12px", marginTop: "4px" }}>
                {errors.amount}
              </p>
            )}
          </div>

          {/* Type toggle */}
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["income", "expense"].map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  style={{
                    flex:         1,
                    padding:      "10px",
                    borderRadius: "12px",
                    fontSize:     "13px",
                    fontWeight:   "700",
                    cursor:       "pointer",
                    transition:   "all 0.2s ease",
                    border: form.type === t
                      ? t === "income" ? "2px solid #10b981" : "2px solid #f43f5e"
                      : `2px solid ${inputBorder}`,
                    background: form.type === t
                      ? t === "income"
                        ? darkMode ? "rgba(16,185,129,0.15)" : "#f0fdf4"
                        : darkMode ? "rgba(244,63,94,0.15)"  : "#fff1f2"
                      : inputBg,
                    color: form.type === t
                      ? t === "income" ? "#10b981" : "#f43f5e"
                      : labelColor,
                  }}
                >
                  {t === "income" ? "💰 Income" : "💸 Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              style={inputStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              style={inputStyle}
            />
            {errors.date && (
              <p style={{ color: "#e11d48", fontSize: "12px", marginTop: "4px" }}>
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding:    "0 28px 24px",
          display:    "flex",
          gap:        "12px",
          background: modalBg,
        }}>
          <button
            onClick={onClose}
            style={{
              flex:         1,
              padding:      "12px",
              borderRadius: "14px",
              border:       `1px solid ${inputBorder}`,
              background:   inputBg,
              color:        labelColor,
              fontSize:     "14px",
              fontWeight:   "700",
              cursor:       "pointer",
              transition:   "all 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex:         1,
              padding:      "12px",
              borderRadius: "14px",
              border:       "none",
              background:   "linear-gradient(135deg, #f97316, #ec4899)",
              color:        "#fff",
              fontSize:     "14px",
              fontWeight:   "700",
              cursor:       "pointer",
              boxShadow:    "0 4px 16px rgba(249,115,22,0.35)",
              transition:   "all 0.2s ease",
            }}
          >
            {isEditing ? "💾 Save Changes" : "➕ Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}