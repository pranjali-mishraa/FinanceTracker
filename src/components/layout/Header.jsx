import { useAppState, useAppDispatch, ACTIONS } from "../../context/AppContext";
import { theme } from "../../theme";
import { useState } from "react";
import { NavLink } from "react-router-dom";

// Mobile nav items
const NAV_ITEMS = [
  { path: "/",             label: "Dashboard",    icon: "📊" },
  { path: "/transactions", label: "Transactions", icon: "💳" },
  { path: "/insights",     label: "Insights",     icon: "💡" },
];

export default function Header() {
  const { role, darkMode } = useAppState();
  const dispatch           = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRoleChange = (e) =>
    dispatch({ type: ACTIONS.SET_ROLE, payload: e.target.value });

  const handleDarkMode = () =>
    dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });

  return (
    <>
      <header
        className={`
          sticky top-0 z-30 w-full
          ${theme.gradient.header}
          border-b border-orange-200
          shadow-sm shadow-orange-100
          backdrop-blur-sm
        `}
      >
        <div className="flex items-center justify-between px-4 md:px-8 h-16">

          {/* ── Mobile: Brand + Hamburger ─────────────────── */}
          <div className="flex items-center gap-3 md:hidden">
            <span className="text-2xl">🪙</span>
            <span className={`font-bold text-lg ${theme.text.primary}`}>
              FinTrack
            </span>
          </div>

          {/* ── Desktop: Page title (empty — sidebar handles brand) */}
          <div className="hidden md:block" />

          {/* ── Right Controls ────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Role Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-orange-700 hidden sm:block">
                Role:
              </span>
              <select
                value={role}
                onChange={handleRoleChange}
                className={`
                  text-sm rounded-xl px-3 py-1.5 font-semibold
                  bg-white/60 border border-orange-300
                  text-orange-800 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                  transition-all duration-200
                `}
              >
                <option value="viewer">👁 Viewer</option>
                <option value="admin">🛡 Admin</option>
              </select>
            </div>

            {/* Role Badge */}
            <span
              className={`
                hidden sm:inline-flex items-center px-3 py-1 rounded-full
                text-xs font-bold tracking-wide
                ${role === "admin"
                  ? "bg-orange-500 text-white"
                  : "bg-white/60 text-orange-700 border border-orange-300"}
              `}
            >
              {role === "admin" ? "🛡 Admin" : "👁 Viewer"}
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={handleDarkMode}
              className={`
                w-9 h-9 rounded-xl flex items-center justify-center
                bg-white/60 border border-orange-200
                hover:bg-orange-100 transition-all duration-200
                text-lg
              `}
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className={`
                md:hidden w-9 h-9 rounded-xl flex items-center justify-center
                bg-white/60 border border-orange-200
                hover:bg-orange-100 transition-all duration-200
              `}
            >
              <span className="text-orange-700 text-xl">
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Dropdown Menu ──────────────────────────── */}
      {menuOpen && (
        <div
          className={`
            md:hidden fixed top-16 left-0 right-0 z-20
            ${theme.gradient.sidebar}
            shadow-xl border-b border-white/20
            flex flex-col px-4 py-4 gap-2
          `}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl
                font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-white/30 text-white shadow-md"
                    : "text-white/80 hover:bg-white/20 hover:text-white"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}