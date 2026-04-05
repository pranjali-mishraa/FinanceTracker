import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";

const NAV_ITEMS = [
  { path: "/",             label: "Dashboard",    icon: "📊" },
  { path: "/transactions", label: "Transactions", icon: "💳" },
  { path: "/insights",     label: "Insights",     icon: "💡" },
];

export default function Header() {
  const { role, darkMode } = useAppState();
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [btnPos,   setBtnPos]   = useState({ top: 72, right: 16 });

  const handleHamburgerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBtnPos({
      top:   rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setMenuOpen((p) => !p);
  };

  // ── Shared button style — reacts to darkMode ──────────────
  const btnStyle = {
    width:          "44px",
    height:         "44px",
    borderRadius:   "99px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    cursor:         "pointer",
    border:         "none",
    transition:     "all 0.2s ease",
    background:     darkMode ? "#2a2a2a" : "rgba(255,255,255,0.9)",
    boxShadow:      darkMode ? "none" : "0 2px 8px rgba(249,115,22,0.08)",
    outline:        darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(249,115,22,0.15)",
    color:          darkMode ? "#d0d0d0" : "#ea580c",
  };

  const roleWrapStyle = {
    display:      "flex",
    alignItems:   "center",
    gap:          "8px",
    padding:      "8px 16px",
    borderRadius: "99px",
    cursor:       "pointer",
    transition:   "all 0.2s ease",
    background:   darkMode ? "#2a2a2a" : "rgba(255,255,255,0.9)",
    outline:      darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(249,115,22,0.15)",
    boxShadow:    darkMode ? "none" : "0 2px 8px rgba(249,115,22,0.06)",
  };

  return (
    <header
      style={{
        position:       "sticky",
        top:            0,
        zIndex:         30,
        width:          "100%",
        height:         "72px",
        display:        "flex",
        alignItems:     "center",
        background:     darkMode ? "rgba(17,17,17,0.95)" : "rgba(255,247,240,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom:   darkMode
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(249,115,22,0.12)",
        boxShadow:      darkMode
          ? "0 2px 20px rgba(0,0,0,0.3)"
          : "0 2px 20px rgba(249,115,22,0.06)",
      }}
    >
      <div style={{
        width:          "100%",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 40px",
      }}>

        {/* ── Brand ── */}
        <NavLink
          to="/"
          style={{ textDecoration: "none" }}  // ← removes underline
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px", lineHeight: 1 }}>🪙</span>
            <span
              className="font-display grad-text"
              style={{
                fontSize:      "32px",
                fontWeight:    "800",
                letterSpacing: "-0.02em",
                lineHeight:    1,
                // In dark mode grad-text is overridden by CSS to #f5f5f5
              }}
            >
              FinTrack
            </span>
          </div>
        </NavLink>

        {/* ── Right controls ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

          {/* Role switcher */}
          <div style={roleWrapStyle}>
            <span style={{
              fontSize:   "16px",
              lineHeight: 1,
            }}>
              {role === "admin" ? "🛡️" : "👁️"}
            </span>
            <select
              value={role}
              onChange={(e) => dispatch({ type: ACTIONS.SET_ROLE, payload: e.target.value })}
              style={{
                fontSize:         "14px",
                fontWeight:       "700",
                color:            darkMode ? "#d0d0d0" : "#92400e",
                background:       "transparent",
                border:           "none",
                outline:          "none",
                cursor:           "pointer",
                WebkitAppearance: "none",
                MozAppearance:    "none",
              }}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <span style={{ color: darkMode ? "#606060" : "#fb923c", fontSize: "12px" }}>▾</span>
          </div>

          {/* Role badge */}
          <span style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          "6px",
            padding:      "8px 16px",
            borderRadius: "99px",
            fontSize:     "13px",
            fontWeight:   "700",
            letterSpacing:"0.03em",
            transition:   "all 0.3s ease",
            background:   role === "admin"
              ? "linear-gradient(135deg,#fb923c,#db2777)"
              : darkMode ? "#2a2a2a" : "rgba(255,255,255,0.9)",
            color:        role === "admin" ? "#fff"
              : darkMode ? "#d0d0d0" : "#c2410c",
            outline:      role === "admin" ? "none"
              : darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(249,115,22,0.15)",
            boxShadow:    role === "admin"
              ? "0 4px 14px rgba(249,115,22,0.35)" : "none",
          }}>
            <span style={{
              width:        "7px",
              height:       "7px",
              borderRadius: "50%",
              background:   role === "admin" ? "#fff" : darkMode ? "#fb923c" : "#f97316",
              animation:    "pulseDot 1.8s ease-in-out infinite",
            }} />
            {role === "admin" ? "Admin" : "Viewer"}
          </span>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE })}
            style={{ ...btnStyle, fontSize: "20px" }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={handleHamburgerClick}
            className="md:hidden"
            style={{ ...btnStyle, fontSize: "20px", fontWeight: "bold" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>

      {/* ── Mobile dropdown portal ── */}
      {menuOpen && createPortal(
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setMenuOpen(false)}
          />
          <div style={{
            position:     "fixed",
            top:          `${btnPos.top}px`,
            right:        `${btnPos.right}px`,
            width:        "200px",
            zIndex:       9999,
            background:   darkMode ? "#1e1e1e" : "#fffbf7",
            border:       darkMode
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(251,146,60,0.15)",
            boxShadow:    darkMode
              ? "0 15px 40px rgba(0,0,0,0.4)"
              : "0 15px 40px rgba(251,146,60,0.15)",
            borderRadius: "16px",
            overflow:     "hidden",
            padding:      "8px",
          }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <div style={{
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "10px",
                    padding:       "10px 14px",
                    borderRadius:  "10px",
                    fontSize:      "14px",
                    fontWeight:    "600",
                    transition:    "all 0.15s ease",
                    background:    isActive
                      ? "linear-gradient(135deg,#fb923c,#db2777)"
                      : "transparent",
                    color:         isActive ? "#fff"
                      : darkMode ? "#d0d0d0" : "#431407",
                  }}>
                    <span style={{ fontSize: "18px" }}>{item.icon}</span>
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </>,
        document.body
      )}
    </header>
  );
}