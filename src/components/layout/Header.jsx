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
  const [btnPos,   setBtnPos]   = useState({ top: 64, right: 16 });

  const handleHamburgerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBtnPos({
      top: rect.bottom + 12,
      right: window.innerWidth - rect.right,
    });
    setMenuOpen((p) => !p);
  };

  return (
    <header
      className="sticky top-0 z-30 w-full"
      style={{
        background: "rgba(255,247,240,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(249,115,22,0.12)",
        boxShadow: "0 2px 20px rgba(249,115,22,0.05)",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-16">

        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 group no-underline"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🪙</span>
          <span
            className="font-display font-bold grad-text"
            style={{ fontSize: "28px", letterSpacing: "-0.02em" }}
          >
            FinTrack
          </span>
        </NavLink>

        {/* Right controls */}
        <div className="flex items-center gap-10">

          {/* Role switcher */}
          <div
            className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-orange-50"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(249,115,22,0.15)",
              borderRadius: "50px",
              boxShadow: "0 2px 8px rgba(249,115,22,0.06)",
            }}
          >
            <select
              value={role}
              onChange={(e) =>
                dispatch({ type: ACTIONS.SET_ROLE, payload: e.target.value })
              }
              className="appearance-none bg-transparent border-none outline-none text-sm font-bold text-orange-800 cursor-pointer p-0 m-0"
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <span className="text-orange-400 text-xs">▾</span>
          </div>

          {/* Role badge */}
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide transition-all duration-300"
            style={{
              borderRadius: "99px",
              background:
                role === "admin"
                  ? "linear-gradient(135deg,#fb923c,#db2777)"
                  : "rgba(255,255,255,0.9)",
              color: role === "admin" ? "#fff" : "#c2410c",
              border:
                role === "admin"
                  ? "none"
                  : "1px solid rgba(249,115,22,0.15)",
              boxShadow:
                role === "admin"
                  ? "0 4px 14px rgba(249,115,22,0.25)"
                  : "0 2px 8px rgba(249,115,22,0.06)",
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full pulse-dot ${
                role === "admin" ? "bg-white" : "bg-orange-500"
              }`}
            />
            {role === "admin" ? "Admin" : "Viewer"}
          </span>

          {/* Dark mode */}
          <button
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE })}
            className="flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(249,115,22,0.15)",
              boxShadow: "0 2px 8px rgba(249,115,22,0.06)",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Hamburger */}
          <button
            onClick={handleHamburgerClick}
            className="flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.9)", 
              border: "1px solid rgba(249,115,22,0.15)",
              boxShadow: "0 2px 8px rgba(249,115,22,0.06)",
              color: "#ea580c",
            }}
          >
            <span className="font-bold text-xl leading-none">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {menuOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0"
              style={{ zIndex: 9998 }}
              onClick={() => setMenuOpen(false)}
            />

            <div
              style={{
                position: "fixed",
                top: `${btnPos.top}px`,
                right: `${btnPos.right}px`,
                height:"100px",
                width: "200px",
                zIndex: 9999,
                background: "#FFFBF7",
                border: "1px solid rgba(251,146,60,0.15)",
                boxShadow: "0 15px 40px rgba(251,146,60,0.15)",
                borderRadius: "12px",
                overflow: "hidden",
         
              }}
            >
              <div className="flex flex-col items-center justify-center py-6 gap-4">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setMenuOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
                    {({ isActive }) => (
                     <div
                     className={`
                       flex items-center justify-center gap-2 px-3 py-2
                       text-[15px] font-medium rounded-md
                       transition-colors duration-150
                   
                       ${
                         isActive
                           ? "bg-orange-400 text-white"
                           : "text-gray-700 hover:bg-orange-100/50 hover:text-gray-900"
                       }
                     `}
                   >
                     <span className="text-lg">{item.icon}</span>
                     <span>{item.label}</span>
                   </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}