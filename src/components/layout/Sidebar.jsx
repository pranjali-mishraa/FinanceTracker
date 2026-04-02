import { NavLink } from "react-router-dom";
import { theme } from "../../theme";

// ── Nav items config — add new pages here in future ──────────
const NAV_ITEMS = [
  { path: "/",            label: "Dashboard",    icon: "📊" },
  { path: "/transactions",label: "Transactions", icon: "💳" },
  { path: "/insights",    label: "Insights",     icon: "💡" },
];

export default function Sidebar() {
  return (
    <aside
      className={`
        hidden md:flex flex-col w-64 min-h-screen
        ${theme.gradient.sidebar}
        shadow-xl shadow-orange-200
      `}
    >
      {/* ── Logo / Brand ───────────────────────────────────── */}
      <div className="px-6 py-7 border-b border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center text-xl shadow-inner">
            🪙
          </div>
          <div>
            <h1 className={`text-lg font-bold ${theme.text.white}`}>
              FinTrack
            </h1>
            <p className="text-xs text-white/70">Personal Finance</p>
          </div>
        </div>
      </div>

      {/* ── Navigation Links ───────────────────────────────── */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl
              font-medium text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-white/30 text-white shadow-md shadow-orange-300/40 scale-[1.02]"
                  : "text-white/80 hover:bg-white/20 hover:text-white"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom Decoration ──────────────────────────────── */}
      <div className="px-6 py-5 border-t border-white/30">
        <p className="text-xs text-white/50 text-center">
          FinTrack v1.0 · 2025
        </p>
      </div>
    </aside>
  );
}